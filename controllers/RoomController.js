const RoomService = require("../services/RoomService");
const httpStatus = require("http-status");
const HotelService = require("../services/HotelService");
const ReservationService = require("../services/ReservationService");
const HotelImageService = require("../services/HotelImageService");
const index = async (req, res) => {
  req.body.hotel = null;
  if (req.query.hotelId != null) {
    req.body.hotel = req.query.hotelId;
  }
  const rooms = await RoomService.listRoom({ hotel: req.body.hotel });
  if (rooms) {
    return res.status(httpStatus.OK).send(rooms);
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "odaları getirirken bir hata oluştu" });
};

const updateRoom = async (req, res) => {
  try {
    const rooms = await RoomService.updateRoom({ hotel: req.body.roomId }, req.body);
    if (rooms) {
      return res.status(httpStatus.OK).send(rooms);
    }
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "odaları getirirken bir hata oluştu" });
  }
};

const createRoom = async (req, res) => {
  if (req.user.isAdmin != true) {
    return res.status(httpStatus.NOT_ACCEPTABLE).send({ msg: "you dont have a permission to do that" });
  }
  req.body.user = req.user?._id;
  // req.body.hotel = req.query.hotelId;
  console.log(req.body);

  try {
    const room = await RoomService.createRoom(req.body);
    if (room) {
      const hotelWithRoom = await HotelService.updateHotel({ _id: req.body.hotel }, { rooms: room._id });
      console.log(hotelWithRoom + "aaaa");
      if (hotelWithRoom) {
        if (req.files && req.files.length > 0) {
          console.log("with files");
          const savedImages = await Promise.all(
            req.files.map((file) =>
              HotelImageService.uploadHotelImage({
                hotel: room._id,
                name: file.filename,
                path: "https://phbackend-m3r9.onrender.com/uploads/" + file.filename,
              })
            )
          );

          if (savedImages && savedImages.length > 0) {
            console.log("Room ve resimler başarıyla kaydedildi");
            const imageIds = savedImages.map((image) => image.path);
            console.log(imageIds);
            console.log(imageIds);
            const updatedRoom = await RoomService.updateRoom(
              { _id: room._id },
              { $push: { image: { $each: imageIds } } }
            );
            if (updatedRoom) {
              return res.status(httpStatus.OK).send(updatedRoom);
            } else {
              console.log("update error");
            }
          }
        } else {
          console.log("without files");
        }

        return res.status(httpStatus.OK).send(room);
      }
    } else {
    }
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).send({ msg: error });
  }
};

const deleteRoom = async (req, res) => {
  const deletedRoom = await RoomService.deleteRoom({ _id: req.body });
  if (deletedRoom) {
    res.status(httpStatus.OK).send({ msg: "oda başarıyla silindi" });
  }
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "yorum silinirken bir hatayla karşılaşıldı!" });
};

const searchRoom = async (req, res) => {
  req.body.city = req.query.city;
  req.body.checkInDate = req.query.checkInDate;
  req.body.checkOutDate = req.query.checkOutDate;
  req.body.personCount = req.query.personCount;
  req.body.price = req.query.price;
  console.log(req.body);
  try {
    const hotels = await HotelService.listHotel({ city: req.body.city });

    // Tüm otellerin odalarını paralel olarak getiriyoruz
    const allRoomsPromises = hotels.map((hotel) =>
      RoomService.listRoom({ hotel: hotel._id, capacity: req.body.personCount, price: req.body.price })
    );
    const allRoomsArray = await Promise.all(allRoomsPromises);

    const allRooms = allRoomsArray.flat(); // Tüm oda listelerini tek bir diziye düzleştirir

    // Tüm odaların uygunluk kontrolünü paralel olarak yapıyoruz
    const suitableRoomsPromises = allRooms.map(async (room) => {
      const isAvailable = await ReservationService.isRoomAvailable({
        roomId: room._id,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
        capacity: req.body.personCount,
      });
      return isAvailable.length === 0 ? room : null;
    });

    // Uygun odaları filtreliyoruz
    const suitableRoomsResults = await Promise.all(suitableRoomsPromises);
    const suitableRooms = suitableRoomsResults.filter((room) => room !== null);

    // Aynı otelde olan odalardan sadece bir tanesini döndürmek için filtreleme yapıyoruz
    const uniqueRooms = [];
    const seenHotels = new Set();

    for (const room of suitableRooms) {
      if (!seenHotels.has(room.hotel.toString())) {
        uniqueRooms.push(room);
        seenHotels.add(room.hotel.toString());
      }
    }

    res.status(200).json(uniqueRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while searching for rooms." });
  }
};

module.exports = { createRoom, index, deleteRoom, searchRoom, updateRoom };
