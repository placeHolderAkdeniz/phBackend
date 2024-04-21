const CommentService = require("../services/CommentService");
const httpStatus = require("http-status");
const HotelService = require("../services/HotelService");

const createComment = async (req, res) => {
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
module.exports = { createComment };
