const UserService = require("../services/UserService");
const CommentService = require("../services/CommentService");
const HotelService = require("../services/HotelService");
const ReservationService = require("../services/ReservationService");
const httpStatus = require("http-status");
const { passwordToHash, generateAccessToken, generateRefreshToken } = require("../scripts/helper");

//  Implement user creation controller
const createUser = async (req, res) => {
  // Check if email is provided
  if (req.body.email) {
    const user = await UserService.findOneUser({ email: req.body.email });
    // Check if email already exists
    if (user) {
      console.log("a");
      return res.status(httpStatus.CONFLICT).send({ msg: "requested email already taken" });
    } else {
      console.log("dfsfs");
      // Hash password and create new user
      req.body.password = passwordToHash(req.body.password);
      UserService.createUser(req.body)
        .then((response) => {
          res.status(httpStatus.CREATED).send(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
};

//  Implement user listing controller
const index = (req, res) => {
  UserService.listUser()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const addFavourite = async (req, res) => {
  try {
    const user = await UserService.findOneUser({ _id: req.user._id });
    user.favorites.push(req.body.hotelId);

    const response = await user.save();
    res.status(httpStatus.OK).send(response);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};
const deleteFavourite = async (req, res) => {
  try {
    const user = await UserService.findOneUser({ _id: req.user._id });
    user.favorites.pull(req.body.hotelId);

    const response = await user.save();
    res.status(httpStatus.OK).send(response);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const getMyHotel = (req, res) => {
  HotelService.listHotel({ ownerEmail: req.user.email })
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  console.log(req.body.password);
  console.log(req.body);
  UserService.findOneUser(req.body)
    .then((response) => {
      if (!response) {
        return res.status(httpStatus.NOT_FOUND).send({ msg: "user not found" });
      } else {
        // Generate tokens and return user data
        user = {
          ...response.toObject(),
          tokens: {
            acces_token: generateAccessToken(response),
            refresh_token: generateRefreshToken(response),
          },
        };
        delete user.password;
        console.log("a");
        return res.status(httpStatus.OK).send(user);
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

//  Implement user update controller
const update = (req, res) => {
  console.log(req.user?._id);
  if (req.body.email) {
    UserService.findOneUser({ email: req.body.email }).then((response) => {
      if (response) {
        return res.status(httpStatus.CONFLICT).send({ msg: "requested email already taken" });
      }
    });
  }

  // Update user information
  UserService.updateUser({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      console.log("aaa");
      return res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((error) => {
      console.log(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "Update güncelleme işlemi sırasında bir problem oluştu",
      });
    });
};

const userReservation = (req, res) => {
  if (req.user._id) {
    ReservationService.findUserReservations({ user: req.user._id }).then((response) => {
      if (response) {
        return res.status(httpStatus.OK).send(response);
      }
    });
  }
};

//  Implement password change controller
const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);

  // Update user password
  UserService.updateUserById({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      console.log("aaa");
      return res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Update güncelleme işlemi sırasında bir problem oluştu" });
    });
};

//  Implement user comment list controller
const userCommentList = async (req, res) => {
  try {
    // Kullanıcı yorumlarını al
    const comments = await CommentService.listComment({ user: req.user?._id });

    if (comments) {
      // Yorumların her biri için otel bilgilerini al ve yeni bir dizi oluştur
      const commentsWithHotelInfo = await Promise.all(
        comments.map(async (comment) => {
          // Yorumun ilgili otel bilgilerini al
          const hotel = await HotelService.listHotel({ _id: comment.hotel });

          return { ...comment._doc, hotelInfo: hotel[0] };
        })
      );
      console.log(commentsWithHotelInfo);
      return res.status(httpStatus.OK).send({ comments: commentsWithHotelInfo });
    } else {
      return res.status(httpStatus.NOT_FOUND).send({ msg: "No user comments found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error });
  }
};

const deleteComment = (req, res) => {
  if (req.user._id) {
    CommentService.deleteComment(req.body.commentId).then((response) => {
      if (response) {
        return res.status(httpStatus.OK).send("yorum başarıyla silindi");
      }
    });
  }
};

const deleteUser = async (req, res) => {
  if (req.user.isAdmin == true) {
    const deletedUser = await UserService.deleteUser({ _id: req.user._id });

    if (deletedUser) {
      const deletedHotel = await HotelService.deleteHotel({ ownerEmail: req.user.email });
      if (deletedHotel) {
        return res.status(httpStatus.OK).send({ msg: "Kullanıcı ve bağlı olduğu oteller başarıyla silindi" });
      }
      return res.status(httpStatus.OK).send({ msg: "Otel silinirken bir hata oluştu!" });
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "Kullanıcı silinirken bir hata oluştu!" });
  }

  UserService.findOneUser(req.user.email)
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

module.exports = {
  index,
  createUser,
  login,
  update,
  changePassword,
  userCommentList,
  deleteUser,
  getMyHotel,
  userReservation,
  addFavourite,
  deleteFavourite,
  deleteComment,
};
