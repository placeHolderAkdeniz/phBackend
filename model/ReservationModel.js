const Mongoose = require("mongoose");

const ReservationSchema = new Mongoose.Schema(
  {
    room: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "room",
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
  },
  { versionKey: false, timestamps: true }
);
module.exports = Mongoose.model("reservation", ReservationSchema);
