const Mongoose = require("mongoose");

//  Define User schema
const UserSchema = new Mongoose.Schema(
  {
    // Defined fields for user data
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
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    userPoint: {
      type: Number,
      default: 0,
    },
    userType: {
      type: String,
      default: "silver",
    },
    isAdmin: {
      type: Boolean,
      required: true,
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
  // Set options for schema
  { versionKey: false, timestamps: true }
);

module.exports = Mongoose.model("user", UserSchema);
