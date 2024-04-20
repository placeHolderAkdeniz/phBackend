const CommentService = require("../services/CommentService");
const httpStatus = require("http-status");

const createComment = async (req, res) => {
  req.body.user = req.user?._id;
  console.log(req.body);

  try {
    const comment = await CommentService.createComment(req.body);
    if (comment) {
      console.log("a");
      return res.status(httpStatus.OK).send(comment);
    } else {
      console.log("b");
    }
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).send({ msg: error });
  }
};
module.exports = { createComment };
