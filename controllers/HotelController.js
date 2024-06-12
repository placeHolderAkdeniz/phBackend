const HotelService = require("../services/HotelService");
const HotelImageService = require("../services/HotelImageService");
const CommentService = require("../services/CommentService");
const ReservationService = require("../services/ReservationService");
const httpStatus = require("http-status");
const fs = require("fs");
const path = require("path");

const klasorYolu = path.join(__dirname, "../uploads");

const createHotel = async (req, res) => {
  console.log("aaaaaaaaaaaaaa");
  if (!req.user.isAdmin) {
    return res.status(httpStatus.NOT_ACCEPTABLE).send({ msg: "You don't have permission to do that" });
  }
  fs.readdir(klasorYolu, (err, dosyaListesi) => {
    if (err) {
      console.error("Klasör okunamadı:", err);
      return;
    }

    // Dosyaları konsola yazdır
    console.log("Klasördeki Dosyalar:");
    dosyaListesi.forEach((dosya) => {
      console.log(dosya);
    });
  });
  req.body.ownerEmail = req.user.email;

  try {
    const hotel = await HotelService.createHotel(req.body);
    if (!hotel) {
      return res.status(httpStatus.BAD_REQUEST).send({ error: "Otel oluşturulamadı" });
    }

    if (req.files && req.files.length > 0) {
      console.log("with files");
      const savedImages = await Promise.all(
        req.files.map((file) =>
          HotelImageService.uploadHotelImage({
            hotel: hotel._id,
            name: file.filename,
            path: "https://phbackend-m3r9.onrender.com/uploads/" + file.filename,
          })
        )
      );

      if (savedImages && savedImages.length > 0) {
        console.log("Otel ve resimler başarıyla kaydedildi");
        const imageIds = savedImages.map((image) => image.path);
        console.log(imageIds);
        const updatedHotel = await HotelService.updateHotel(
          { _id: hotel._id },
          { $push: { image: { $each: imageIds } } }
        );
        if (updatedHotel) {
          return res.status(httpStatus.OK).send(updatedHotel);
        } else {
          console.log("update error");
        }
      }
    } else {
      console.log("without files");
    }

    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.BAD_REQUEST).send({ msg: error.message });
  }
};

const index = async (req, res) => {
  // if (req.query.city == "all") {
  //   console.log(req.query);
  // }
  // if (req.query != "all") {
  //   req.body.city = req.query.city;
  // }
  // if (!req.query.city) {
  //   console.log("sss");
  //   req.body = req.user?.city;
  // }
  // console.log(req.query);

  const hotel = await HotelService.listHotel(req.body);
  if (hotel) {
    res.status(httpStatus.OK).send(hotel);
  } else {
    res.status(httpStatus.NOT_FOUND).send({ msg: "otel bulunamadı" });
  }
};

const getHotelsByAverageStar = async (req, res) => {
  const hotel = await HotelService.getHotelsByAverageStar();
  if (hotel) {
    res.status(httpStatus.OK).send(hotel);
  } else {
    res.status(httpStatus.NOT_FOUND).send({ msg: "otel bulunamadı" });
  }
};

const getHotelsByHygieneStar = async (req, res) => {
  const hotel = await HotelService.getHotelsByHygieneStar();
  if (hotel) {
    res.status(httpStatus.OK).send(hotel);
  } else {
    res.status(httpStatus.NOT_FOUND).send({ msg: "otel bulunamadı" });
  }
};

const getHotelsBySafetyStar = async (req, res) => {
  const hotel = await HotelService.getHotelsBySafetyStar();
  if (hotel) {
    res.status(httpStatus.OK).send(hotel);
  } else {
    res.status(httpStatus.NOT_FOUND).send({ msg: "otel bulunamadı" });
  }
};

const getHotelsByTransportationStar = async (req, res) => {
  const hotel = await HotelService.getHotelsByTransportationStar();
  if (hotel) {
    res.status(httpStatus.OK).send(hotel);
  } else {
    res.status(httpStatus.NOT_FOUND).send({ msg: "otel bulunamadı" });
  }
};

const hotelCommentList = (req, res) => {
  CommentService.listComment({ hotel: req.body?.hotelId }).then((response) => {
    if (response) {
      return res.status(httpStatus.OK).send({ comments: response });
    } else {
      return res.status(httpStatus.NOT_FOUND).send({ msg: "No user comments found" });
    }
  });
};
const hotelReservationList = (req, res) => {
  console.log(req.body?.hotelId);

  ReservationService.findReservation({ hotel: req.body?.hotelId }).then((response) => {
    if (response) {
      return res.status(httpStatus.OK).send({ reservations: response });
    } else {
      return res.status(httpStatus.NOT_FOUND).send({ msg: "No user comments found" });
    }
  });
};
const hotelImageList = (req, res) => {
  try {
    HotelImageService.listComment({ user: req.user?._id }).then((response) => {
      if (response) {
        return res.status(httpStatus.OK).send({ comments: response });
      } else {
        return res.status(httpStatus.NOT_FOUND).send({ msg: "No user comments found" });
      }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error });
  }
};

module.exports = {
  createHotel,
  index,
  hotelCommentList,
  hotelReservationList,
  getHotelsByAverageStar,
  getHotelsByHygieneStar,
  getHotelsBySafetyStar,
  getHotelsByTransportationStar,
};
