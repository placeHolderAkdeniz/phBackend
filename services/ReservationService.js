const ReservationModel = require("../model/ReservationModel");

const isRoomAvailable = (where) => {
  return ReservationModel.find({
    room: where.roomId,

    $or: [{ checkInDate: { $lte: where.checkOutDate }, checkOutDate: { $gte: where.checkInDate } }],
    // price: { $lte: where.price },
  });
};

const createReservation = (where) => {
  return new ReservationModel({
    room: where.roomId,
    checkInDate: where.checkInDate,
    checkOutDate: where.checkOutDate,
    user: where.user,
    hotel: where.hotel,
  }).save();
};

const findUserReservations = (where) => {
  return ReservationModel.find(where).populate({
    path: "room",
    select: "hotel",
  });
};

const findReservationAndDelete = (where) => {
  return ReservationModel.findByIdAndDelete(where);
};
const findReservation = (where) => {
  return ReservationModel.find({ hotel: where.hotel });
};

const updateReservation = (id, data) => {
  return ReservationModel.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  createReservation,
  isRoomAvailable,
  findUserReservations,
  findReservationAndDelete,
  updateReservation,
  findReservation,
};
