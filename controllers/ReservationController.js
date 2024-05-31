const ReservationService = require("../services/ReservationService");
const httpStatus = require("http-status");

const isRoomAvailable = async (req, res) => {
  req.body.user = req.user._id;

  try {
    const isRoomAvailable = await ReservationService.isRoomAvailable(req.body);

    if (isRoomAvailable.length != 0) {
      return res
        .status(httpStatus.CONFLICT)
        .send({ success: false, message: "Room is not available for the selected dates." });
    } else {
      const newReservation = await ReservationService.createReservation(req.body);

      if (!newReservation) {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ success: false, message: "An error occurred while creating the reservation." });
      } else {
        return res
          .status(httpStatus.CREATED)
          .send({ succes: true, message: "Reservation created successfully." });
      }
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: error });
  }
};

module.exports = {
  isRoomAvailable,
};
