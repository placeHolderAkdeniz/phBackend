const Mongoose = require("mongoose");

const HotelImageSchema = new Mongoose.Schema({
  //   profileImage: {
  //     type: String,
  //   },
  //   images: [{
  //     type:String
  //   }],
  name: {
    type: String,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  hotel: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "hotel",
  },
});
module.exports = Mongoose.model("hotelImage", HotelImageSchema);
