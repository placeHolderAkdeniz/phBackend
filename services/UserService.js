const UserModel = require("../model/UserModel");

const loginUser = (loginData) => {
  return UserModel.findOne(loginData);
};
const listUser = (where) => {
  return UserModel.find(where || {});
};
const createUser = (userData) => {
  return new UserModel(userData).save();
};

const findOneUser = (where) => {
  return UserModel.findOne(where);
};
const updateUserById = (id, data) => {
  return UserModel.findByIdAndUpdate(id, data, { new: true }).select({ password: 0 });
};

const updateUser = (where, data) => {
  return UserModel.findOneAndUpdate(where, data, { new: true }).select({ password: 0 });
};
const deleteUser = (id) => {
  return UserModel.findByIdAndDelete(id);
};
module.exports = {
  loginUser,
  listUser,
  createUser,
  findOneUser,
  updateUser,
  updateUserById,
  deleteUser,
};
