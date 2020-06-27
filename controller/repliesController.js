// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require("../models/replies");
const Comments = require("../models/comments");

const CustomError = require("../utils/customError");
import responseHandler from "../utils/responseHandler";

const getCommentReplies = async (req, res, next) => {
  const { commentId } = req.params;
  console.log(commentId);
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

module.exports = {
  getCommentReplies,
};
