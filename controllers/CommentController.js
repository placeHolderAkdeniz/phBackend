const CommentService = require("../services/CommentService");
const httpStatus = require("http-status");
const HotelService = require("../services/HotelService");
const ReservationService = require("../services/ReservationService");
const RoomService = require("../services/RoomService");
const startCoefficient = {
  silver: 0.2,
  gold: 0.3,
  emerald: 0.5,
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

  req.body.user = req.user?._id;
  req.body.hotel = req.query.hotelId;

  const coefficient = startCoefficient[req.user.userType];

  if (coefficient) {
    const normalizeRating = (rating) => {
      console.log(coefficient);
      const normalizedRating = rating * coefficient; // Orta puanı 2.5 varsayarak normalizasyon
      console.log(normalizedRating);
      return Math.max(1, Math.min(normalizedRating, 5)); // Puanları 1 ile 5 arasında sınırlıyoruz
    };

    req.body.transportation_star = normalizeRating(Number(req.body.transportation_star));
    req.body.safety_star = normalizeRating(Number(req.body.safety_star));
    req.body.hygiene_star = normalizeRating(Number(req.body.hygiene_star));
  }

  try {
    const comment = await CommentService.createComment(req.body);
    if (!comment) {
      return res.status(httpStatus.BAD_REQUEST).send({ msg: "Comment could not be created" });
    }

    const [hotel, commentList] = await Promise.all([
      HotelService.listHotel({ _id: req.body.hotel }),
      CommentService.listComment({ hotel: req.body.hotel }),
    ]);

    if (!hotel || hotel.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send({ msg: "Hotel not found" });
    }

    const commentLength = commentList.length;

    const { transportation_star, safety_star, hygiene_star } = req.body;

    const forTransportation_star =
      (hotel[0].transportation_star * (commentLength - 1) + transportation_star) / commentLength;
    const forSafety_star = (hotel[0].safety_star * (commentLength - 1) + safety_star) / commentLength;
    const forHygiene_star = (hotel[0].hygiene_star * (commentLength - 1) + hygiene_star) / commentLength;

    const forAverage = (forHygiene_star + forSafety_star + forTransportation_star) / 3;
    // console.log(forTransportation_star);
    // console.log(forSafety_star);
    // console.log(forHygiene_star);
    // console.log(forAverage);
    const hotelWithComment = await HotelService.updateHotel(
      { _id: req.body.hotel },
      {
        transportation_star: forTransportation_star,
        hygiene_star: forHygiene_star,
        safety_star: forSafety_star,
        average_star: forAverage,
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
};

const deleteComment = async (req, res) => {
  const deletedComment = await CommentService.deleteComment({ _id: req.body });
  if (deletedComment) {
    res.status(httpStatus.OK).send({ msg: "yorum başarıyla silindi" });
  }
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "yorum silinirken bir hatayla karşılaşıldı!" });
};

module.exports = { createComment, index, deleteComment };
