const { ObjectId } = require("mongoose").Types;

// Models
const Comments = require("../../models/comments");
const Replies = require("../../models/replies");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const replyHandler = require("../../utils/replyHandler");

/**
 * @author
 *
 * Gets a  single reply.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const getSingleReply = async (req, res, next) => {
  const { commentId, replyId } = req.params;
  const { applicationId } = req.token;

  if (!ObjectId.isValid(commentId)) {
    return next(new CustomError(422, " Invalid comment Id "));
  }
  if (!ObjectId.isValid(replyId)) {
    return next(new CustomError(422, " Invalid reply Id "));
  }
  try {
    //check if such comment exists
    const comment = await Comments.findOne({ _id: commentId, applicationId });
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

    return responseHandler(res, 200, replyHandler(reply), " Reply found ");
  } catch (err) {
    next(
      new CustomError(500, " Something went wrong, please try again later,err")
    );
  }
};

module.exports = getSingleReply;
