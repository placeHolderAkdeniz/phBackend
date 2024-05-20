const CommentService = require("../services/CommentService");
const httpStatus = require("http-status");
const HotelService = require("../services/HotelService");

const index = async (req, res) => {
  const comments = await CommentService.listComment();
  if (comments) {
    return res.status(httpStatus.OK).send(comments);
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "yorumları getirirken bir hata oluştu" });
};

const createComment = async (req, res) => {
  if (req.user.isAdmin != true) {
    return res.status(httpStatus.NOT_ACCEPTABLE).send({ msg: "you dont have a permission to do that" });
  }
  req.body.user = req.user?._id;
  req.body.hotel = req.query.hotelId;
  console.log(req.body);

  try {
    const comment = await CommentService.createComment(req.body);
    if (comment) {
      console.log("a");
      const hotelWithComment = await HotelService.updateHotel(
        { _id: req.body.hotel },
        { comments: comment._id }
      );
      if (hotelWithComment) {
        return res.status(httpStatus.OK).send(comment);
      }
    } else {
      console.log("b");
    }
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).send({ msg: error });
  }
};

const deleteComment = async (req, res) => {
  const deletedComment = await CommentService.deleteComment({ _id: req.body });
  if (deletedComment) {
    res.status(httpStatus.OK).send({ msg: "yorum başarıyla silindi" });
  }
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "yorum silinirken bir hatayla karşılaşıldı!" });
};

module.exports = { createComment, index, deleteComment };
