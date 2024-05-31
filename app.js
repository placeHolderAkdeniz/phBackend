const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./loaders/db");
const UserRoutes = require("./routes/UserRoute");
const HotelRoutes = require("./routes/HotelRoute");
const RoomRoutes = require("./routes/RoomRoute");
const CommentRoutes = require("./routes/CommentRoute");
const ReservationRoute = require("./routes/ReservationRoute");

const httpStatus = require("http-status");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

connectDB();

app.listen(10000, () => {
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
