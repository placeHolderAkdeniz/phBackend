const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: "silver",
    },
    reservations: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "reservation",
      },
    ],
    comments: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "comment",
      },
    ],
    favorites: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "hotel",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);
module.exports = Mongoose.model("user", UserSchema);
