const CommentService = require("../services/CommentService");
const httpStatus = require("http-status");
const HotelService = require("../services/HotelService");

const startCoefficient = {
  silver: 1,
  gold: 2,
  emerald: 3,
};

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
  console.log(req.user.userType);
  console.log(req.body.hotel);
  const coefficient = startCoefficient[req.user.userType];

  if (coefficient) {
    req.body.transportation_star = coefficient * Number(req.body.transportation_star);
    req.body.safety_star = coefficient * Number(req.body.safety_star);
    req.body.hygiene_star = coefficient * Number(req.body.hygiene_star);
  }

  try {
    const comment = await CommentService.createComment(req.body);
    console.log(comment);
    if (comment) {
      const hotel = await HotelService.listHotel({ _id: req.body.hotel });
      console.log(hotel);

      const forTransportation_star =
        (hotel[0].transportation_star * hotel[0].comments.length + req.body.transportation_star) /
        (hotel[0].comments.length + 1);

      const forSafety_star =
        (hotel[0].safety_star * hotel[0].comments.length + req.body.safety_star) /
        (hotel[0].comments.length + 1);
      const forHygiene_star =
        (hotel[0].hygiene_star * hotel[0].comments.length + req.body.hygiene_star) /
        (hotel[0].comments.length + 1);
      const forAverage = (forHygiene_star + forSafety_star + forHygiene_star) / 3;
      console.log(forTransportation_star);
      console.log(forSafety_star);
      console.log(forHygiene_star);
      console.log(forAverage);
      const hotelWithComment = await HotelService.updateHotel(
        { _id: req.body.hotel },
        {
          transportation_star: forTransportation_star,
          hygiene_star: forHygiene_star,
          safety_star: forSafety_star,
          average_star: forAverage,
        }
      );
      console.log(hotelWithComment);
      if (hotelWithComment) {
        console.log("vvvvv");
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
