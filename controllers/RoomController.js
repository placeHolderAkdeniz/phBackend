const RoomService = require("../services/RoomService");
const httpStatus = require("http-status");
const HotelService = require("../services/HotelService");
const ReservationService = require("../services/ReservationService");

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

const createRoom = async (req, res) => {
  if (req.user.isAdmin != true) {
    return res.status(httpStatus.NOT_ACCEPTABLE).send({ msg: "you dont have a permission to do that" });
  }
  req.body.user = req.user?._id;
  req.body.hotel = req.query.hotelId;
  console.log(req.body);

  try {
    const room = await RoomService.createRoom(req.body);
    if (room) {
      const hotelWithRoom = await HotelService.updateHotel({ _id: req.body.hotel }, { rooms: room._id });
      if (hotelWithRoom) {
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
  try {
    const hotels = await HotelService.listHotel({ city: req.body.city });

    // Tüm otellerin odalarını paralel olarak getiriyoruz
    const allRoomsPromises = hotels.map((hotel) =>
      RoomService.listRoom({ hotel: hotel._id, capacity: req.body.personCount })
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

    res.status(200).json(suitableRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while searching for rooms." });
  }
};

module.exports = { createRoom, index, deleteRoom, searchRoom };
