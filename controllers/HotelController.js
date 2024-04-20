const HotelService = require("../services/HotelService");
const httpStatus = require("http-status");

const createHotel = async (req, res) => {
  console.log(req.body);
  try {
    const hotel = await HotelService.createHotel(req.body);
    if (hotel) {
      console.log("a");
      return res.status(httpStatus.OK).send(hotel);
    } else {
      console.log("b");
    }
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send({ msg: error });
  }
};
module.exports = { createHotel };
