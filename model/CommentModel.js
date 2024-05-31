const Mongoose = require("mongoose");

const CommentSchema = new Mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },
    hygiene_star: {
      type: Number,
      required: true,
    },
    safety_star: {
      type: Number,
      required: true,
    },
    transportation_star: {
      type: Number,
      required: true,
    },
    likes: {
      type: Number,
      required: false,
      default: 0,
    },
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    hotel: { type: Mongoose.Schema.Types.ObjectId, ref: "hotel" },
  },
  { versionKey: false, timestamps: true }
);
module.exports = Mongoose.model("comment", CommentSchema);
