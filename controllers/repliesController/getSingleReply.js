const { ObjectId } = require("mongoose").Types;

// Models
const Comments = require("../../models/comments");
const Replies = require("../../models/replies");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

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

    const data = {
      replyId: reply._id,
      commentId: reply.commentId,
      ownerId: reply.ownerId,
      content: reply.content,
      numOfVotes: reply.upVotes.length + reply.downVotes.length,
      numOfUpVotes: reply.upVotes.length,
      numOfDownVotes: reply.downVotes.length,
      numOfFlags: reply.flags.length,
    };

    return responseHandler(res, 200, data, " Reply found ");
  } catch (err) {
    next(
      new CustomError(500, " Something went wrong, please try again later,err")
    );
  }
};

module.exports = getSingleReply;
