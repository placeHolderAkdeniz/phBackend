const RoomModel = require("../model/RoomModel");

const createRoom = (data) => {
  return new RoomModel(data).save();
};
const listRoom = (where) => {
  const query = where || {};

  if (where && where.priceMin !== undefined && where.priceMax !== undefined) {
    query.price = {
      $gte: where.priceMin,
      $lte: where.priceMax,
    };
  } else if (where && where.priceMin !== undefined) {
    query.price = { $gte: where.priceMin };
  } else if (where && where.priceMax !== undefined) {
    query.price = { $lte: where.priceMax };
  }

  const { priceMax, priceMin, ...remain } = query;
  if (where.totalCapacity !== undefined) {
    remain.totalCapacity = { $gte: where.totalCapacity };
  }
  console.log(remain);
  return RoomModel.find(remain).populate({
    path: "hotel",
    select: "hotel_name _id city average_star",
  });
};

const searchRoom = (where) => {
  return RoomModel.find(where || {}).populate({
    path: "hotel",
    select: "hotel_name _id city",
  });
};
const updateRoom = (where, data) => {
  return RoomModel.findOneAndUpdate(where, data, { new: true });
};

const deleteRoom = (id) => {
  return RoomModel.findByIdAndDelete(id);
};
module.exports = { createRoom, listRoom, updateRoom, deleteRoom, searchRoom };
