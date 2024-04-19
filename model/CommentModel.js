const Mongoose = require("mongoose");

const CommentSchema = new Mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },
    likes: {
      type: number,
      required: false,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true }
);
module.exports = Mongoose.model("comment", CommentSchema);
