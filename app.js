const express = require("express");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const { connectDB } = require("./loaders/db");
const UserRoutes = require("./routes/UserRoute");
const HotelRoutes = require("./routes/HotelRoute");
const RoomRoutes = require("./routes/RoomRoute");
const CommentRoutes = require("./routes/CommentRoute");
const ReservationRoute = require("./routes/ReservationRoute");
const path = require("path");
const httpStatus = require("http-status");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const uploadFolderPath = path.join(__dirname, "./uploads");

// Klasörü kontrol et ve oluştur
if (!fs.existsSync(uploadFolderPath)) {
  fs.mkdirSync(uploadFolderPath);
}

app.use("/uploads", express.static(path.join(__dirname, "./", "uploads")));
dotenv.config();
console.log("aaaaaaaaaaaaaa");
connectDB();

app.listen(10000, () => {
  console.log("bbbbbbbbbbbbbbb");
  console.log("sunucu çalışıyor");
  app.use("/users", UserRoutes.router);
  app.use("/hotels", HotelRoutes.router);
  app.use("/comments", CommentRoutes.router);
  app.use("/rooms", RoomRoutes.router);
  app.use("/bookings", ReservationRoute.router);
  app.get("/", (req, res) => {
    res.status(httpStatus.OK).send("PLACEHOLDER'A HOŞGELDİNİZ!");
  });
});
