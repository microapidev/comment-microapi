// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require('../models/replies');
const Comments = require('../models/comments');
const mongoose = require('mongoose');
const CustomError = require('../utils/customError');
// const User = require("../models/users");

exports.getCommentReplies = (req, res, next) => {
  const commentId = mongoose.Types.ObjectId(req.params.commentId);
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    const error = new CustomError(400, `Please provide a valid ID.`);
    next(error);
  }
  console.log(commentId);
  Comments.findById(commentId)
    .populate('replies')
    .populate('commentOwner')
    .then((response) => {
      return res.status(200).json({ response });
    })
    .catch(next);
};
