const UserService = require("../services/UserService");
const httpStatus = require("http-status");
const { passwordToHash, generateAccessToken, generateRefreshToken } = require("../scripts/helper");

const createUser = async (req, res) => {
  if (req.body.email) {
    const user = await UserService.findOneUser({ email: req.body.email });
    if (user) {
      console.log("a");
      return res.status(httpStatus.CONFLICT).send({ msg: "requested email already taken" });
    } else {
      console.log("dfsfs");
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

const index = (req, res) => {
  UserService.listUser()
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

const update = (req, res) => {
  console.log(req.user?._id);
  if (req.body.email) {
    UserService.findOneUser({ email: req.body.email }).then((response) => {
      if (response) {
        return res.status(httpStatus.CONFLICT).send({ msg: "requested email already taken" });
      }
    });
  }

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

const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);

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
module.exports = { index, createUser, login, update, changePassword };
