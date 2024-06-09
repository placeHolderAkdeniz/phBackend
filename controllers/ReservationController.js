const ReservationService = require("../services/ReservationService");
const UserService = require("../services/UserService");

const httpStatus = require("http-status");

const isRoomAvailable = async (req, res) => {
  req.body.user = req.user._id;
  const userPoint = req.user.userPoint;

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
