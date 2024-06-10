const express = require("express");
const {
  createHotel,
  index,
  hotelCommentList,
  hotelReservationList,
  getHotelsByAverageStar,
  getHotelsByHygieneStar,
  getHotelsBySafetyStar,
  getHotelsByTransportationStar,
} = require("../controllers/HotelController");
const RoomController = require("../controllers/RoomController");
const authenticate = require("../middlewares/authenticate");
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});
const upload = multer({ storage });
const router = express.Router();
router.route("/").get(index);
router.route("/average-star").get(getHotelsByAverageStar);
router.route("/hygiene-star").get(getHotelsByHygieneStar);
router.route("/safety-star").get(getHotelsBySafetyStar);
router.route("/transportation-star").get(getHotelsByTransportationStar);
router.route("/comments").get(hotelCommentList);
router.route("/bookings").get(hotelReservationList);
router.route("/rooms").get(RoomController.index);
router.route("/images").get(index);

router.route("/").post(authenticate, upload.array("files"), createHotel);

module.exports = { router };
