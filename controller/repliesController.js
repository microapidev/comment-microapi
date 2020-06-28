// UNCOMMENT EACH MODEL HERE AS NEEDED
const { ObjectId } = require("mongoose").Types;

const Replies = require("../models/replies");
const Comments = require("../models/comments");

const CustomError = require("../utils/customError");
import responseHandler from "../utils/responseHandler";

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
      console.log(comment);
      return next(new CustomError(404, " Comment not found "));
    }

    const replies = await Replies.find({ comment_id: commentId });
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
        comment_id: commentId,
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
    if (!reply) {
      return res.status(404).json({
        status: "error",
        message: `Reply with the ID ${replyId} doesn't exist or has been deleted`,
        data: null,
      });
    }
    const data = {
      replyId: reply._id,
      commentId: reply.comment_id,
      isFlagged: reply.isFlagged,
      numOfFlags: reply.numOfFlags,
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
