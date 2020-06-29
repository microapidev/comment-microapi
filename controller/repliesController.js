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

const flagCommentReplies = async (req, res, next) => {
  const { commentId, replyId } = req.params;

  if (!ObjectId.isValid(commentId)) {
    return next(new CustomError(422, " Invalid comment Id "));
  }

  if (!ObjectId.isValid(replyId)) {
    return next(new CustomError(422, " Invalid reply Id "));
  }
  try {
    const reply = await Replies.findOneAndUpdate(
      {
        _id: replyId,
        commentId: commentId,
      },
      {
        isFlagged: true,
      },
      {
        new: true,
      }
    );
    if (!reply) {
      return res.status(404).json({
        status: "error",
        message: `Reply with the ID ${replyId} doesn't exist or has been deleted`,
        data: null,
      });
    }
    const data = {
      replyId: reply._id,
      commentId: reply.commentId,
      isFlagged: reply.isFlagged,
    };

    return responseHandler(
      res,
      200,
      data,
      "Reply has been flagged successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentReplies,
  flagCommentReplies,
};
