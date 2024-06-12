const CommentModel = require("../model/CommentModel");

const createComment = (data) => {
  return new CommentModel(data).save();
};

const listComment = (where) => {
  return CommentModel.find(where || {}).populate({
    path: "user",
    select: "first_name last_name userType _id userType",
  });
};

const updateComment = () => {
  return CommentModel.findOneAndUpdate(where, data, { new: true });
};

const deleteComment = (id) => {
  return CommentModel.findByIdAndDelete(id);
};
module.exports = { createComment, listComment, updateComment, deleteComment };
