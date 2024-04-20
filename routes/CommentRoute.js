const express = require("express");
const { createComment } = require("../controllers/CommentController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.route("/").post(authenticate, createComment);

module.exports = { router };
