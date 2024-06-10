const express = require("express");
const { createRoom, deleteRoom, index, searchRoom, updateRoom } = require("../controllers/RoomController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();
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

router.route("/").get(index);
router.route("/").patch(updateRoom);
router.route("/search-rooms").get(searchRoom);
router.route("/images").get(index);
router.route("/").post(authenticate, upload.array("files"), createRoom);

module.exports = { router };
