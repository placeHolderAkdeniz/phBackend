const HotelModel = require("../model/HotelModel");

const createHotel = (data) => {
  return new HotelModel(data).save();
};
const deleteHotel = (where) => {
  return HotelModel.findOneAndDelete(where);
};

const listHotel = (where) => {
  if (where.average_star) {
    where.average_star = { $in: where.average_star }; // $in operatörü ile dizi içindeki değerleri kontrol eder
  } else {
    // Eğer average_star alanı tanımlanmamışsa veya dizi şeklinde değilse
    delete where.average_star;
  }

  return HotelModel.find(where || {}).populate({
    path: "image",
    select: "name image path",
  });
};

const getHotelsByAverageStar = (where) => {
  return HotelModel.find(where || {})
    .sort({ average_star: -1 })
    .populate({
      path: "image",
      select: "name image path",
    });
};

const getHotelsByHygieneStar = (where) => {
  return HotelModel.find(where || {})
    .sort({ hygiene_star: -1 })
    .populate({
      path: "image",
      select: "name image path",
    });
};

const getHotelsBySafetyStar = (where) => {
  return HotelModel.find(where || {})
    .sort({ safety_star: -1 })
    .populate({
      path: "image",
      select: "name image path",
    });
};

const getHotelsByTransportationStar = (where) => {
  return HotelModel.find(where || {})
    .sort({ transportation_star: -1 })
    .populate({
      path: "image",
      select: "name image path",
    });
};

const updateHotel = (where, data) => {
  return HotelModel.findOneAndUpdate(where, data, { new: true });
};

module.exports = {
  createHotel,
  listHotel,
  updateHotel,
  deleteHotel,
  getHotelsByAverageStar,
  getHotelsByHygieneStar,
  getHotelsBySafetyStar,
  getHotelsByTransportationStar,
};
