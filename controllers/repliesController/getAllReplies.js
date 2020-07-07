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
 * Gets all replies.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getAllReplies = async (req, res, next) => {
  const { commentId } = req.params;
  const { isFlagged, ownerId } = req.query;

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

    // Create query for replies.
    let query = {};

    query.commentId = commentId;
    if (ownerId) query.ownerId = ownerId;

    if (typeof isFlagged === "string") {
      if (isFlagged === "true") {
        query["flags.0"] = { $exists: true };
      } else if (isFlagged === "false") {
        query["flags.0"] = { $exists: false };
      }
    }

    const replies = await Replies.find(query);
    let message = " Replies found. ";
    if (!replies.length) {
      message = " No replies found. ";
    }

    const data = replies.map((reply) => {
      return {
        replyId: reply._id,
        commentId: reply.commentId,
        ownerId: reply.ownerId,
        content: reply.content,
        numOfVotes: reply.upVotes.length + reply.downVotes.length,
        numOfUpVotes: reply.upVotes.length,
        numOfDownVotes: reply.downVotes.length,
        numOfFlags: reply.flags.length,
      };
    });

    return responseHandler(res, 200, data, message);
  } catch (err) {
    next(err);
  }
};

module.exports = getAllReplies;
