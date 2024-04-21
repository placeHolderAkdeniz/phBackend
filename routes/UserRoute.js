const express = require("express");
const {
  createUser,
  index,
  login,
  update,
  changePassword,
  userCommentList,
} = require("../controllers/UserController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.route("/").get(index);
router.route("/comments").get(authenticate, userCommentList);

//router.route("/bookings").get(authenticate,)
router.route("/").post(createUser);
router.route("/login").post(login);
router.route("/change-password").patch(authenticate, changePassword);
router.route("/").patch(authenticate, update);

module.exports = { router };
