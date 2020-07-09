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
 * Updates a single reply's list of up votes through a toggle functionality.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const updateSingleReplyUpVotes = async (req, res, next) => {
  const commentId = req.params.commentId;
  const replyId = req.params.replyId;
  const ownerId = req.body.ownerId;
  const { applicationId } = req.token;
  let isUpvoted = false;

  try {
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

    let reply = await Replies.findById(replyId);
    if (!reply) {
      return next(new CustomError(404, "Reply not found or deleted"));
    }

    if (reply.downVotes.includes(ownerId)) {
      //get index of user in downvotes array
      const voterIndex = reply.downVotes.indexOf(ownerId);
      //if index exists
      if (voterIndex > -1) {
        //delete that index
        reply.downVotes.splice(voterIndex, 1);
      }
    }

    //same as above for upvotes
    if (reply.upVotes.includes(ownerId)) {
      const voterIndex = reply.upVotes.indexOf(ownerId);
      if (voterIndex > -1) {
        reply.upVotes.splice(voterIndex, 1);
      }
    } else {
      // add user to the upvotes array
      reply.upVotes.push(ownerId);
      isUpvoted = true;
    }

    //save the reply vote
    const savedReply = await reply.save();

    //Check the reply vote state
    const message = isUpvoted
      ? "Reply upvoted successfully!"
      : "Reply upvote removed successfully!";

    return responseHandler(res, 200, replyHandler(savedReply), message);
  } catch (error) {
    return next(
      new CustomError(
        500,
        "Something went wrong, try again " + error.stack,
        error
      )
    );
  }
};

module.exports = updateSingleReplyUpVotes;
