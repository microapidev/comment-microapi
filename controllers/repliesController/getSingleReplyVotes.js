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
 * Gets a single reply's list of votes.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getSingleReplyVotes = async (req, res, next) => {
  try {
    const { commentId, replyId } = req.params;
    const { voteType } = req.query;

    if (!ObjectId.isValid(commentId)) {
      return next(new CustomError(404, "Invalid ID"));
    }

    if (!ObjectId.isValid(replyId)) {
      return next(new CustomError(404, "Invalid ID"));
    }

    const parentComment = await Comments.findById(commentId);

    // Check to see if the parent comment exists.
    if (!parentComment) {
      return next(
        new CustomError(
          404,
          `Comment with the ID ${commentId} does not exist or has been deleted`
        )
      );
    }

    const reply = await Replies.findById(replyId);

    // Check to see if the reply exists.
    if (!reply) {
      return next(
        new CustomError(
          404,
          `Reply with the ID ${replyId} does not exist or has been deleted`
        )
      );
    }

    // A list of all the votes
    const votes = [];

    if (!voteType) {
      // Add all votes
      votes.push(...reply.upVotes);
      votes.push(...reply.downVotes);
    } else {
      if (voteType.toString() === "upvote") {
        // Add upvotes only
        votes.push(...reply.upVotes);
      }

      if (voteType.toString() === "downvote") {
        // Add downvotes only
        votes.push(...reply.downVotes);
      }
    }

    // The data object to be returned in the response
    const data = {
      replyId,
      commentId,
      votes,
    };

    return responseHandler(res, 200, data, "OK");
  } catch (error) {
    return next(
      new CustomError(
        500,
        "Something went wrong, please try again later",
        error
      )
    );
  }
};

module.exports = getSingleReplyVotes;
