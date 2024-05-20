const Mongoose = require("mongoose");

const HotelSchema = new Mongoose.Schema(
  {
    hotel_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    hotel_desc: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      required: false,
      default: 0,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
    reservations: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "reservation",
      },
    ],
    image: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "hotelImage",
    },
    comments: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
    rooms: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "room",
    },
  },
  { versionKey: false, timestamps: true }
);
module.exports = Mongoose.model("hotel", HotelSchema);
