const mongoose = require("mongoose");

// Models
const Comments = require("../../models/comments");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author EricoMartin
 *
 * Updates a single comment's list of up votes through a toggle functionality.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const updateSingleCommentUpVotes = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { ownerId } = req.body;
    const { applicationId } = req.token;
    let isUpvoted = false;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      next(new CustomError(422, "invalid ID"));
      return;
    }
    const comment = await Comments.findOne({
      _id: commentId,
      applicationId: applicationId,
    });

    if (!comment) {
      return next(new CustomError(404, "Comment Id not found"));
    }

    //if user exists in downvotes array
    if (comment.downVotes.includes(ownerId)) {
      //get index of user in downvotes array
      const voterIndex = comment.downVotes.indexOf(ownerId);
      //if index exists
      if (voterIndex > -1) {
        //delete that index
        comment.downVotes.splice(voterIndex, 1);
      }
    }

    //same as above for upvotes
    if (comment.upVotes.includes(ownerId)) {
      const voterIdx = comment.upVotes.indexOf(ownerId);
      if (voterIdx > -1) {
        comment.upVotes.splice(voterIdx, 1);
      }
    } else {
      // add user to the top of the upvotes array
      comment.upVotes.unshift(ownerId);
      isUpvoted = true;
    }

    //save the comment vote
    comment.save();

    //get total number of elements in array
    const totalUpVotes = comment.upVotes.length;
    const totalDownVotes = comment.downVotes.length;

    //get total number of votes
    const totalVotes = totalUpVotes + totalDownVotes;

    //Check the comment vote state
    const message = isUpvoted
      ? "Comment upvote added successfully!"
      : "Comment upvote removed successfully!";

    const data = {
      commentId: comment._id,
      numOfVotes: totalVotes,
      numOfUpVotes: totalUpVotes,
      numOfDownVotes: totalDownVotes,
    };
    return responseHandler(res, 200, data, message);
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong, please try again later", err)
    );
  }
};

module.exports = updateSingleCommentUpVotes;
