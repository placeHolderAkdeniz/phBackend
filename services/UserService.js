const UserModel = require("../model/UserModel");

// Implemented user login functionality
const loginUser = (loginData) => {
  return UserModel.findOne(loginData);
};

// Added functionality to list users based on optional query parameters
const listUser = (where) => {
  return UserModel.find(where || {});
};

// Implemented user creation functionality
const createUser = (userData) => {
  return new UserModel(userData).save();
};

// Added functionality to find a single user based on specified criteria
const findOneUser = (where) => {
  return UserModel.findOne(where);
};

// Implemented user update functionality by ID
const updateUserById = (id, data) => {
  return UserModel.findByIdAndUpdate(id, data, { new: true }).select({ password: 0 });
};

// Added functionality to update a single user based on specified criteria
const updateUser = (where, data) => {
  return UserModel.findOneAndUpdate(where, data, { new: true }).select({ password: 0 });
};

// Implemented user deletion functionality
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
