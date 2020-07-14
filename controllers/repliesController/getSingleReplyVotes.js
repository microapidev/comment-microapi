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
    // const { voteType } = req.query;
    const { applicationId } = req.token;

    if (!ObjectId.isValid(commentId)) {
      return next(new CustomError(404, "Invalid ID"));
    }

    if (!ObjectId.isValid(replyId)) {
      return next(new CustomError(404, "Invalid ID"));
    }

    //confirm reply belongs to a comment in the same application
    const parentComment = await Comments.findOne({
      _id: commentId,
      applicationId,
    });
    if (!parentComment) {
      next(
        new CustomError(
          404,
          `Comment with the ID ${commentId} does not exist or has been deleted`
        )
      );
      return;
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

    // The data object to be returned in the response
    const data = {
      replyId,
      commentId,
      totalVotes: reply.upVotes.length + reply.downVotes.length,
      numOfUpVotes: reply.upVotes.length,
      numOfDownVotes: reply.downVotes.length,
      updatedAt: reply.updatedAt.toString(),
    };

    return responseHandler(
      res,
      200,
      data,
      "Reply Votes Retrieved Successfully"
    );
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
