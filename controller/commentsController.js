// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require('../models/replies');
const Comments = require('../models/comments');
const mongoose = require('mongoose');
const CustomError = require('../utils/customError');
// const User = require("../models/users");
const errHandler = require('../utils/errorhandler');

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
exports.flagComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comments.findOneAndUpdate(
      {
        _id: commentId,
      },
      {
        isFlagged: true,
        $inc: {
          numOfFlags: 1,
        },
      },
      {
        new: true,
      }
    );
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(422).json({
        status: 'error',
        response: '422 error',
        message: 'Invalid ID',
      });
    }
    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: `Comment with the ID ${commentId} doesn't exist or has been deleted`,
        data: null,
      });
    }
    return res.status(200).json({
      message: 'Comment has been flagged successfully',
      response: '200 OK',
      data: {
        commentId: comment._id,
        isFlagged: comment.isFlagged,
        numOfflags: comment.numOfFlags,
      },
    });
  } catch (error) {
    errHandler(error, res);
  }
};
