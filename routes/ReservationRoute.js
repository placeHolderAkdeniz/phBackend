const express = require("express");
const {
  isRoomAvailable,
  deleteReservation,
  updateReservation,
} = require("../controllers/ReservationController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

//router.route("/").post(authenticate, createComment);
router.route("/").post(authenticate, isRoomAvailable);
router.route("/").delete(authenticate, deleteReservation);
router.route("/").patch(authenticate, updateReservation);
module.exports = { router };
