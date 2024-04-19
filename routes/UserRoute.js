const express = require("express");
const { createUser, index, login, update, changePassword } = require("../controllers/UserController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.route("/").get(index);
//router.route("/bookings").get(authenticate,)
router.route("/").post(createUser);
router.route("/login").post(login);
router.route("/change-password").patch(authenticate, changePassword);
router.route("/").patch(authenticate, update);

module.exports = { router };
