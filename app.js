const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./loaders/db");
const UserRoutes = require("./routes/UserRoute");
const HotelRoutes = require("./routes/HotelRoute");
const CommentRoutes = require("./routes/CommentRoute");
const httpStatus = require("http-status");
const app = express();
app.use(express.json());
dotenv.config();

connectDB();

app.listen(10000, () => {
  console.log("sunucu çalışıyor");
  app.use("/users", UserRoutes.router);
  app.use("/hotels", HotelRoutes.router);
  app.use("/comments", CommentRoutes.router);
  app.get("/", (req, res) => {
    res.status(httpStatus.OK).send("PLACEHOLDER'A HOŞGELDİNİZ!");
  });
});
