const RoomModel = require("../model/RoomModel");

const createRoom = (data) => {
  return new RoomModel(data).save();
};

const listRoom = (where) => {
  return RoomModel.find(where || {}).populate({
    path: "hotel",
    select: "hotel_name _id",
  });
};

const updateRoom = () => {
  return RoomModel.findOneAndUpdate(where, data, { new: true });
};

const deleteRoom = (id) => {
  return RoomModel.findByIdAndDelete(id);
};
module.exports = { createRoom, listRoom, updateRoom, deleteRoom };
