const HotelService = require("../services/HotelService");
const HotelImageService = require("../services/HotelImageService");
const CommentService = require("../services/CommentService");
const ReservationService = require("../services/ReservationService");
const httpStatus = require("http-status");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../cloudinaryConfig");

const createHotel = async (req, res) => {
  console.log("Creating hotel");
  if (!req.user.isAdmin) {
    return res.status(httpStatus.NOT_ACCEPTABLE).send({ msg: "You don't have permission to do that" });
  }

  req.body.ownerEmail = req.user.email;

  try {
    const hotel = await HotelService.createHotel(req.body);
    if (!hotel) {
      return res.status(httpStatus.BAD_REQUEST).send({ error: "Otel oluşturulamadı" });
    }

    if (req.files && req.files.length > 0) {
      console.log("Uploading files to Cloudinary");
      const savedImages = await Promise.all(
        req.files.map(async (file) => {
          console.log(file);
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: "hotels", // Optional: specify a folder in Cloudinary
              public_id: file.filename, // Optional: specify a public ID
            });

            return {
              hotel: hotel._id,
              name: result.public_id,
              path: result.secure_url,
            };
          } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            throw new Error("Cloudinary upload failed");
          }
        })
      );

      if (savedImages && savedImages.length > 0) {
        console.log("Otel ve resimler başarıyla kaydedildi");
        const imageIds = savedImages.map((image) => image.path);
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
  try {
    console.log(req.query);
    const hotel = await HotelService.listHotel(req.query);
    if (hotel) {
      res.status(httpStatus.OK).send(hotel);
    } else {
      res.status(httpStatus.NOT_FOUND).send({ msg: "otel bulunamadı" });
    }
  } catch (error) {
    console.log(error);
    res.status(httpStatus.NOT_FOUND).send(error);
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
  req.body.hotelId = req.query.hotelId;
  try {
    CommentService.listComment({ hotel: req.body?.hotelId }).then((response) => {
      if (response) {
        return res.status(httpStatus.OK).send({ comments: response });
      } else {
        return res.status(httpStatus.NOT_FOUND).send({ msg: "No user comments found" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
};
const hotelReservationList = (req, res) => {
  req.body.hotelId = req.query.hotelId;
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

const updateHotel = async (req, res) => {
  console.log("a");
  if (req.user.isAdmin == false) {
    return res.status(httpStatus.UNAUTHORIZED).send("admin yetkisi gerekmektedir");
  }

  try {
    console.log(req.query);
    const { hotelId, ...remain } = req.body;
    const hotel = await HotelService.updateHotel({ _id: hotelId }, remain);
    console.log(hotel);
    if (hotel) {
      return res.status(httpStatus.OK).send(hotel);
    }
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "oteli getirirken bir hata oluştu" });
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
  updateHotel,
};
