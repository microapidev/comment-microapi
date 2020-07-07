const mongoose = require("mongoose");

// Models
const Comments = require("../../models/comments");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author Alao Abiodun
 *
 * Gets a single comment's list of votes.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getSingleCommentVotes = async (req, res, next) => {
  const { applicationId } = req.token;
  try {
    const { commentId } = req.params;
    const { voteType } = req.query;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return next(new CustomError(404, "invalid ID"));
    }
    const comment = await Comments.findOne({
      _id: commentId,
      applicationId: applicationId,
    });
    if (!comment) {
      return next(
        new CustomError(
          404,
          `Comment with the ID ${commentId} doesn't exist or has been removed`
        )
      );
    }

    // votes array to store totalVotes, and also store upvotes or downvotes
    const votes = [];

    if (!voteType) {
      // Insert both upvotes and downvotes
      votes.push(...comment.upVotes);
      votes.push(...comment.downVotes);
    } else {
      // Insert upvotes only
      if (voteType.toString() === "upvote") {
        votes.push(...comment.upVotes);
      }
      if (voteType.toString() === "downvote") {
        // Insert downvotes only
        votes.push(...comment.downVotes);
      }
    }

    const data = {
      commentId,
      votes,
    };

    return responseHandler(
      res,
      200,
      data,
      "Comment Votes Retrieved Successfully"
    );
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong, Try again later", err)
    );
  }
};

module.exports = getSingleCommentVotes;
