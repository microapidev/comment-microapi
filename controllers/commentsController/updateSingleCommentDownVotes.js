const mongoose = require("mongoose");

// Models
const Comments = require("../../models/comments");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author EricoMartin
 *
 * Updates a single comment's list of down votes through a toggle functionality.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const updateSingleCommentDownVotes = async (req, res, next) => {
  try {
    const { applicationId } = req.token;
    const { commentId } = req.params;
    const { ownerId } = req.body;
    let isDownvoted = false;

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
    //if user exists in upvotes array
    if (comment.upVotes.includes(ownerId)) {
      //get index of user in upvotes array
      const voterIndex = comment.upVotes.indexOf(ownerId);
      //if index exists
      if (voterIndex > -1) {
        //delete that index
        comment.upVotes.splice(voterIndex, 1);
      }
    }

    //same as above for downvotes
    if (comment.downVotes.includes(ownerId)) {
      const voterIdx = comment.downVotes.indexOf(ownerId);
      if (voterIdx > -1) {
        comment.downVotes.splice(voterIdx, 1);
      }
    } else {
      // add user to the top of the downvotes array
      comment.downVotes.unshift(ownerId);
      isDownvoted = true;
    }

    //save the comment vote
    await comment.save();

    //get total number of elements in array
    const totalUpVotes = comment.upVotes.length;
    const totalDownVotes = comment.downVotes.length;

    //get total number of votes
    const totalVotes = totalUpVotes + totalDownVotes;

    //Check the comment vote state
    const message = isDownvoted
      ? "Comment downvote added successfully!"
      : "Comment downvote removed successfully!";

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

module.exports = updateSingleCommentDownVotes;
