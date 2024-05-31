const express = require("express");
const { isRoomAvailable } = require("../controllers/ReservationController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

//router.route("/").post(authenticate, createComment);
router.route("/").post(authenticate, isRoomAvailable);
module.exports = { router };
