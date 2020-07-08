// Models
const Comments = require("../../models/comments");
const Replies = require("../../models/replies");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author
 *
 * Updates a single reply's list of down votes through a toggle functionality.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const updateSingleReplyDownVotes = async (req, res, next) => {
  const commentId = req.params.commentId;
  const replyId = req.params.replyId;
  const ownerId = req.body.ownerId;
  const { applicationId } = req.token;

  try {
    let isDownvoted = false;
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

    //if user exists in upvotes array
    if (reply.upVotes.includes(ownerId)) {
      //get index of user in upvotes array
      const voterIndex = reply.upVotes.indexOf(ownerId);
      //if index exists
      if (voterIndex > -1) {
        //delete that index
        reply.upVotes.splice(voterIndex, 1);
      }
    }

    //same as above for downvotes
    if (reply.downVotes.includes(ownerId)) {
      const voterIdx = reply.downVotes.indexOf(ownerId);
      if (voterIdx > -1) {
        reply.downVotes.splice(voterIdx, 1);
      }
    } else {
      // add user to the top of the downvotes array
      reply.downVotes.unshift(ownerId);
      isDownvoted = true;
    }

    //save the reply vote
    reply.save();

    //get total number of elements in array
    const totalUpVotes = reply.upVotes.length;
    const totalDownVotes = reply.downVotes.length;

    //get total number of votes
    const totalVotes = totalUpVotes + totalDownVotes;

    //Check the reply vote state
    const message = isDownvoted
      ? "Reply downvote added successfully!"
      : "Reply downvote removed successfully!";

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

module.exports = updateSingleReplyDownVotes;
