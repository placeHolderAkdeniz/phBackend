const HotelService = require("../services/HotelService");
const HotelImageService = require("../services/HotelImageService");
const httpStatus = require("http-status");
const fs = require("fs");

const createHotel = async (req, res) => {
  console.log(req.body.hotel_name);

  try {
    const hotel = await HotelService.createHotel(req.body);

    if (!hotel) {
      return res.status(httpStatus.BAD_REQUEST).send({ error: "Otel oluşturulamadı" });
    }
    if (req.file) {
      console.log("with file");
      console.log(req.file.originalname);
      console.log(req.file.mimetype);
      console.log(req.file.path);

      const savedImage = await HotelImageService.uploadHotelImage({
        hotel: hotel._id,
        name: req.file.originalname,
        image: {
          data: fs.readFileSync(req.file.path),
          contentType: req.file.mimetype,
        },
      });
      if (savedImage) {
        console.log("Otel ve resim başarıyla kaydedildi");
      }
    } else {
      console.log("without file");
    }

    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send({ msg: error });
  }
};

const index = async (req, res) => {
  const hotel = await HotelService.listHotel();
  if (hotel) {
    res.status(httpStatus.OK).send(hotel);
  } else {
    res.status(httpStatus.NOT_FOUND).send({ msg: "otel bulunamadı" });
  }
};

const hotelIamgeList = (req, res) => {
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

module.exports = { createHotel, index };
