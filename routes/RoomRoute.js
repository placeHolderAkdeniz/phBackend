const express = require("express");
const { createRoom, deleteRoom, index } = require("../controllers/RoomController");
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
router.route("/images").get(index);
router.route("/").post(authenticate, upload.single("file"), createRoom);

module.exports = { router };
