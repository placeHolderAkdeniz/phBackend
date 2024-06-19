const Mongoose = require("mongoose");

const RoomSchema = new Mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    adult: {
      type: Number,
      required: true,
    },
    child: {
      type: Number,
      required: true,
    },
    totalCapacity: {
      type: Number,
      required: true,
    },

    doubleBed: {
      type: Number,
      required: true,
    },
    singleBed: {
      type: Number,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    image: [
      {
        type: String,
      },
    ],
    hotel: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "hotel",
      required: true,
    },
  },

  { versionKey: false, timestamps: true }
);
module.exports = Mongoose.model("room", RoomSchema);
