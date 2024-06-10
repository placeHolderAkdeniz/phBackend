const express = require("express");
const { createHotel, index, hotelCommentList } = require("../controllers/HotelController");
const RoomController = require("../controllers/RoomController");
const authenticate = require("../middlewares/authenticate");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage });
const router = express.Router();
router.route("/").get(index);
router.route("/comments").get(hotelCommentList);
router.route("/rooms").get(RoomController.index);
router.route("/images").get(index);

router.route("/").post(authenticate, upload.array("files"), createHotel);

module.exports = { router };
