const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./loaders/db");
const UserRoutes = require("./routes/UserRoute");
const httpStatus = require("http-status");
const app = express();
app.use(express.json());
dotenv.config();

connectDB();

app.listen(3000, () => {
  console.log("sunucu çalışıyor");
  app.use("/users", UserRoutes.router);
  app.get("/", (req, res) => {
    res.status(httpStatus.OK).send("PLACEHOLDER'A HOŞGELDİNİZ!");
  });
});
