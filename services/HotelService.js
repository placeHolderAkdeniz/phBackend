const HotelModel = require("../model/HotelModel");

const createHotel = (data) => {
  return new HotelModel(data).save();
};
const deleteHotel = (where) => {
  return HotelModel.findOneAndDelete(where);
};

const listHotel = (where) => {
  return HotelModel.find(where || {})
    .populate({
      path: "image",
      select: "name image",
    })
    .populate({
      path: "comments",
      select: "value likes",
    });
};

const updateHotel = (where, data) => {
  return HotelModel.findOneAndUpdate(where, data, { new: true });
};

module.exports = { createHotel, listHotel, updateHotel, deleteHotel };
