const express = require("express");
const { createHotel, index } = require("../controllers/HotelController");
const RoomController = require("../controllers/RoomController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.route("/").get(index);

router.route("/rooms").get(RoomController.index);
router.route("/images").get(index);

router.route("/").post(authenticate, upload.single("file"), createHotel);

module.exports = { router };
