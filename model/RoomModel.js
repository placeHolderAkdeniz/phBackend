const Mongoose = require("mongoose");

const RoomSchema = new Mongoose.Schema(
  {
    hotel: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "hotel",
      required: true,
    },
    roomStatus: {
      type: Boolean,
      default: 1,
    },

    type: String,
    price: Number,
    capacity: Number,
  },
  { versionKey: false, timestamps: true }
);
module.exports = Mongoose.model("room", RoomSchema);
