const UserService = require("../services/UserService");
const CommentService = require("../services/CommentService");
const HotelService = require("../services/HotelService");
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
const getMyHotel = (req, res) => {
  HotelService.listHotel({ ownerEmail: req.user.email })
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

//  Implement user login controller
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
const userCommentList = (req, res) => {
  try {
    // Retrieve user comments
    CommentService.listComment({ user: req.user?._id }).then((response) => {
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

module.exports = { index, createUser, login, update, changePassword, userCommentList, deleteUser, getMyHotel };
