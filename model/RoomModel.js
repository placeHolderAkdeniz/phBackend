const Mongoose = require("mongoose");

const RoomSchema = new Mongoose.Schema(
  {
    hotel: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "hotel",
      required: true,
    },
    image: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "hotelImage",
      },
    ],

    price: Number,
    capacity: Number,
  },
  { versionKey: false, timestamps: true }
);
module.exports = Mongoose.model("room", RoomSchema);
