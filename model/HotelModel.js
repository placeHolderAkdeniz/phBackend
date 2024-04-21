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
    address: {
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
    reservations: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "reservation",
      },
    ],

    // image: {
    //   type: String,
    //   required: true,
    // },

    // comments: {
    //   type: Mongoose.Schema.Types.ObjectId,
    //   ref: "comment",
    // },
  },
  { versionKey: false, timestamps: true }
);
module.exports = Mongoose.model("hotel", HotelSchema);
