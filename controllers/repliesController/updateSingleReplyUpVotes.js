// Models
const Comments = require("../../models/comments");
const Replies = require("../../models/replies");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

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

  try {
    let isUpvoted = false;
    //confirm reply belongs to a comment in the same application
    const comment = await Comments.findOne({
      _id: commentId,
      applicationId,
    });
    if (!comment) {
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

    //if user exists in downvotes array
    if (reply.downVotes.includes(ownerId)) {
      //get index of user in upvotes array
      const voterIndex = reply.downVotes.indexOf(ownerId);
      //if index exists
      if (voterIndex > -1) {
        //delete that index
        reply.downVotes.splice(voterIndex, 1);
      }
    }

    //same as above for upvotes
    if (reply.upVotes.includes(ownerId)) {
      const voterIdx = reply.upVotes.indexOf(ownerId);
      if (voterIdx > -1) {
        reply.upVotes.splice(voterIdx, 1);
      }
    } else {
      // add user to the top of the downvotes array
      reply.upVotes.unshift(ownerId);
      isUpvoted = true;
    }

    //save the reply vote
    reply.save();

    //get total number of elements in array
    const totalUpVotes = reply.upVotes.length;
    const totalDownVotes = reply.downVotes.length;

    //get total number of votes
    const totalVotes = totalUpVotes + totalDownVotes;

    //Check the reply vote state
    const message = isUpvoted
      ? "Reply upvote added successfully!"
      : "Reply upvote removed successfully!";

    const data = {
      commentId,
      replyId,
      numOfVotes: totalVotes,
      numOfUpVotes: totalUpVotes,
      numOfDownVotes: totalDownVotes,
    };

    return responseHandler(res, 200, data, message);
  } catch (error) {
    return next(new CustomError(500, "Something went wrong, try again", error));
  }
};

module.exports = updateSingleReplyUpVotes;
