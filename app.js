const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./loaders/db");
const UserRoutes = require("./routes/UserRoute");
const app = express();
app.use(express.json());
dotenv.config();

connectDB();

app.listen(3000, () => {
  console.log("sunucu çalışıyor");
  app.use("/users", UserRoutes.router);
});
