const ReservationService = require("../services/ReservationService");
const UserService = require("../services/UserService");
const RoomService = require("../services/RoomService");
const httpStatus = require("http-status");

// const isRoomAvailable = async (req, res) => {
//   req.body.user = req.user._id;

//   try {
//     const findRoom = await RoomService({ hotel: req.body.hotelId });

//     const isRoomAvailable = await ReservationService.isRoomAvailable(req.body);

//     if (isRoomAvailable.length != 0) {
//       return res
//         .status(httpStatus.CONFLICT)
//         .send({ success: false, message: "Room is not available for the selected dates." });
//     } else {
//       const newReservation = await ReservationService.createReservation(req.body);

//       if (!newReservation) {
//         return res
//           .status(httpStatus.INTERNAL_SERVER_ERROR)
//           .send({ success: false, message: "An error occurred while creating the reservation." });
//       } else {
//         const user = await UserService.findOneUser({ _id: req.user._id });
//         user.userPoint = user.userPoint + 1;

//         if (user.userPoint >= 10 && user.userPoint < 30) {
//           user.userType = "gold";
//         }
//         if (user.userPoint >= 30) {
//           user.userType = "emerald";
//         }
//         await user.save();

//         return res
//           .status(httpStatus.CREATED)
//           .send({ succes: true, message: "Reservation created successfully." });
//       }
//     }
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: error });
//   }
// };

const isRoomAvailable = async (req, res) => {
  req.body.user = req.user._id;

  try {
    // İlgili oteldeki tüm odaları getir
    const findRoom = await RoomService.listRoom({ hotel: req.body.hotelId, capacity: req.body.personCount });

    // Her oda için uygunluk kontrolü yap
    const availableRoomsPromises = findRoom.map(async (room) => {
      const isAvailable = await ReservationService.isRoomAvailable({
        roomId: room._id,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
      });
      return isAvailable.length === 0 ? room : null;
    });

    // Uygun odaları filtrele
    const availableRoomsResults = await Promise.all(availableRoomsPromises);
    const availableRooms = availableRoomsResults.filter((room) => room !== null);

    // Eğer uygun oda yoksa, hata döndür
    if (availableRooms.length === 0) {
      return res
        .status(httpStatus.CONFLICT)
        .send({ success: false, message: "Room is not available for the selected dates." });
    }

    // Uygun odalardan birini al (örneğin, ilkini)
    const selectedRoom = availableRooms[0];

    // Rezervasyon verilerini güncelle
    req.body.roomId = selectedRoom._id;
    req.body.hotel = selectedRoom.hotel._id;
    console.log(selectedRoom.hotel._id);
    // Yeni rezervasyon oluştu
    console.log(req.body);
    const newReservation = await ReservationService.createReservation(req.body);

    if (!newReservation) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ success: false, message: "An error occurred while creating the reservation." });
    } else {
      const user = await UserService.findOneUser({ _id: req.user._id });
      user.userPoint = user.userPoint + 1;

      if (user.userPoint >= 10 && user.userPoint < 30) {
        user.userType = "gold";
      }
      if (user.userPoint >= 30) {
        user.userType = "emerald";
      }
      await user.save();

      return res
        .status(httpStatus.CREATED)
        .send({ success: true, message: "Reservation created successfully." });
    }
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: error.message });
  }
};

module.exports = {
  isRoomAvailable,
};
