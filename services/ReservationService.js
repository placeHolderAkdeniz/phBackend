const ReservationModel = require("../model/ReservationModel");

const isRoomAvailable = (where) => {
  return ReservationModel.find({
    room: where.roomId,

    $or: [{ checkInDate: { $lte: where.checkOutDate }, checkOutDate: { $gte: where.checkInDate } }],
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

module.exports = { createReservation, isRoomAvailable, findUserReservations };
