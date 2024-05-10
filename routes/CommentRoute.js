const express = require("express");
const { createComment, index } = require("../controllers/CommentController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.route("/").post(authenticate, createComment);
router.route("/").get(index);
module.exports = { router };
