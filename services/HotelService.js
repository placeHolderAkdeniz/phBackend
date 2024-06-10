const HotelModel = require("../model/HotelModel");

const createHotel = (data) => {
  return new HotelModel(data).save();
};
const deleteHotel = (where) => {
  return HotelModel.findOneAndDelete(where);
};

const listHotel = (where) => {
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
