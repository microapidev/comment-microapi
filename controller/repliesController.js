// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require("../models/replies");
const Comments = require("../models/comments");
const { ObjectId } = require("mongoose").Types;

const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");

const getCommentReplies = async (req, res, next) => {
  const { commentId } = req.params;

  if (!ObjectId.isValid(commentId)) {
    return next(new CustomError(400, " Invalid comment Id "));
  }
  try {
    //check if such comment exists
    const comment = await Comments.findById(commentId);
    // If the comment does not exist,send an error msg
    if (!comment) {
      return next(new CustomError(404, " Comment not found "));
    }

    const replies = await Replies.find({ commentId: commentId }).populate(
      "replyOwner"
    );
    let message = " Replies found. ";
    if (!replies.length) {
      message = " No replies found. ";
    }
    return responseHandler(res, 200, replies, message);
  } catch (err) {
    next(err);
  }
};

// GET a single reply
const getASingleReply = async (req, res, next) => {
  const { commentId, replyId } = req.params;

  if (!ObjectId.isValid(commentId)) {
    return next(new CustomError(400, " Invalid comment Id "));
  }
  if (!ObjectId.isValid(replyId)) {
    return next(new CustomError(400, " Invalid reply Id "));
  }
  try {
    //check if such comment exists
    const comment = await Comments.findById(commentId);
    // If the comment does not exist,send an error msg
    if (!comment) {
      return next(new CustomError(404, " Comment not found "));
    }
    const reply = await Replies.findOne({
      $and: [{ commentId }, { _id: replyId }],
    });
    if (!reply) {
      return next(new CustomError(404, " Reply not found "));
    }
    return responseHandler(res, 200, reply, " Reply found ");
  } catch (err) {
    next(
      new CustomError(500, " Something went wrong, please try again later,err")
    );
  }
};
module.exports = {
  getCommentReplies,
  getASingleReply,
};
