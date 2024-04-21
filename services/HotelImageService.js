const HotelImageModel = require("../model/HotelImageModel");

const uploadHotelImage = (data) => {
  return new HotelImageModel(data).save();
};

const listImages = (where) => {
  return HotelImageModel.find(where || {}).populate({
    path: "hotel",
  });
};

module.exports = { uploadHotelImage };
