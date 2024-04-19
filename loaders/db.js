const Mongoose = require("mongoose");
const db = Mongoose.connection;

const connectDB = async () => {
  await Mongoose.connect(process.env.MONGO_URI);
};
db.once("open", () => {
  console.log("database connected successfuly");
});

module.exports = {
  connectDB,
};
