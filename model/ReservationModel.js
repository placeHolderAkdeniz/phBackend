const Mongoose = require("mongoose");

const ReservationSchema = new Mongoose.Schema(
  {
    room: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "room",
      required: true,
    },
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    hotel: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "hotel",
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    status: {
      type: Boolean,
      required: false,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true }
);
module.exports = Mongoose.model("reservation", ReservationSchema);
