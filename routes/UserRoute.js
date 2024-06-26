const express = require("express");
const {
  createUser,
  index,
  login,
  update,
  changePassword,
  userCommentList,
  deleteUser,
  getMyHotel,
  userReservation,
  addFavourite,
  deleteFavourite,
  deleteComment,
} = require("../controllers/UserController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

// Implemented endpoint to retrieve all users
router.route("/").get(index);
router.route("/favorites").post(authenticate, addFavourite);
router.route("/my-bookings").get(authenticate, userReservation);
router.route("/my-hotel").get(authenticate, getMyHotel);
// Implemented endpoint to retrieve comments of authenticated user
router.route("/comments").get(authenticate, userCommentList);
router.route("/comments").delete(authenticate, deleteComment);
// Implemented endpoint to create a new user
router.route("/").post(createUser);

// Implemented endpoint for user login
router.route("/login").post(login);

// Implemented endpoint for changing user password
router.route("/change-password").patch(authenticate, changePassword);

// Implemented endpoint for updating user information
router.route("/").patch(authenticate, update);
router.route("/").delete(authenticate, deleteUser);
router.route("/favorites").delete(authenticate, deleteFavourite);
module.exports = { router };
