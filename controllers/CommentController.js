const CommentService = require("../services/CommentService");
const httpStatus = require("http-status");
const HotelService = require("../services/HotelService");
const ReservationService = require("../services/ReservationService");
const RoomService = require("../services/RoomService");
const startCoefficient = {
  silver: 1,
  gold: 3,
  emerald: 5,
};

const index = async (req, res) => {
  const comments = await CommentService.listComment();
  if (comments) {
    return res.status(httpStatus.OK).send(comments);
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "yorumları getirirken bir hata oluştu" });
};
const createComment = async (req, res) => {
  if (req.user.isAdmin !== true) {
    return res.status(httpStatus.NOT_ACCEPTABLE).send({ msg: "You don't have permission to do that" });
  }
  try {
    req.body.user = req.user?._id;
    req.body.hotel = req.query.hotelId;

    startCoefficient[req.user.userType];

    const tempHotel = await HotelService.listHotel({ _id: req.body.hotel });

    const oldSafety_star = tempHotel[0].safety_star;
    const oldTransportation_star = tempHotel[0].transportation_star;
    const oldHygiene_star = tempHotel[0].hygiene_star;

    const commentsAll = await CommentService.listComment({ hotel: req.body.hotel });
    var oldCof = 0;
    commentsAll.map((comment) => (oldCof += startCoefficient[comment.user.userType]));

    const totalOldSafety_star = oldCof * oldSafety_star;
    const totalOldTransportation_star = oldCof * oldTransportation_star;
    const totalOldHygiene_star = oldCof * oldHygiene_star;

    const newSafetyStar =
      (totalOldSafety_star + req.body.safety_star * startCoefficient[req.user.userType]) /
      (oldCof + startCoefficient[req.user.userType]);

    const newTransportationStar =
      (totalOldTransportation_star + req.body.transportation_star * startCoefficient[req.user.userType]) /
      (oldCof + startCoefficient[req.user.userType]);

    const newHygieneStar =
      (totalOldHygiene_star + req.body.hygiene_star * startCoefficient[req.user.userType]) /
      (oldCof + startCoefficient[req.user.userType]);

    const newAverageStar = (newHygieneStar + newSafetyStar + newTransportationStar) / 3;

    try {
      const comment = await CommentService.createComment(req.body);
      if (!comment) {
        return res.status(httpStatus.BAD_REQUEST).send({ msg: "Comment could not be created" });
      }

      if (!tempHotel || tempHotel.length === 0) {
        return res.status(httpStatus.NOT_FOUND).send({ msg: "Hotel not found" });
      }

      const hotelWithComment = await HotelService.updateHotel(
        { _id: req.body.hotel },
        {
          transportation_star: newTransportationStar.toFixed(1),
          hygiene_star: newHygieneStar.toFixed(1),
          safety_star: newSafetyStar.toFixed(1),
          average_star: newAverageStar.toFixed(1),
        }
      );

      if (!hotelWithComment) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "Hotel update failed" });
      }

      return res.status(httpStatus.OK).send(comment);
    } catch (error) {
      console.error(error);
      return res.status(httpStatus.BAD_REQUEST).send({ msg: error.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).send({ msg: error.message });
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
