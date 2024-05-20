const RoomService = require("../services/RoomService");
const httpStatus = require("http-status");
const HotelService = require("../services/HotelService");

const index = async (req, res) => {
  req.body.hotel = null;
  if (req.query.hotelId != null) {
    req.body.hotel = req.query.hotelId;
  }
  const rooms = await RoomService.listRoom({ hotel: req.body.hotel });
  if (rooms) {
    return res.status(httpStatus.OK).send(rooms);
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "odaları getirirken bir hata oluştu" });
};

const createRoom = async (req, res) => {
  if (req.user.isAdmin != true) {
    return res.status(httpStatus.NOT_ACCEPTABLE).send({ msg: "you dont have a permission to do that" });
  }
  req.body.user = req.user?._id;
  req.body.hotel = req.query.hotelId;
  console.log(req.body);

  try {
    const room = await RoomService.createRoom(req.body);
    if (room) {
      console.log("a");
      const hotelWithRoom = await HotelService.updateHotel({ _id: req.body.hotel }, { rooms: room._id });
      if (hotelWithRoom) {
        return res.status(httpStatus.OK).send(room);
      }
    } else {
      console.log("b");
    }
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).send({ msg: error });
  }
};

const deleteRoom = async (req, res) => {
  const deletedRoom = await RoomService.deleteRoom({ _id: req.body });
  if (deletedRoom) {
    res.status(httpStatus.OK).send({ msg: "oda başarıyla silindi" });
  }
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "yorum silinirken bir hatayla karşılaşıldı!" });
};

module.exports = { createRoom, index, deleteRoom };
