const express = require("express");
const { createHotel } = require("../controllers/HotelController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.route("/").post(authenticate, createHotel);

module.exports = { router };
