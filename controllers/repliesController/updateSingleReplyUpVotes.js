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

  try {
    let comment = await Comments.findById(commentId);
    if (!comment) {
      return next(new CustomError(404, "Comment not found or deleted"));
    }
    let reply = await Replies.findById(replyId);
    if (!reply) {
      return next(new CustomError(404, "Reply not found or deleted"));
    }

    if (reply.downVotes.includes(ownerId)) {
      const voterIndex = reply.downVotes.indexOf(ownerId);
      //if index exists
      if (voterIndex > -1) {
        //delete that index
        reply.downVotes.splice(voterIndex, 1);
      }
    }
    if (reply.upVotes.includes(ownerId)) {
      const ownerIdx = reply.upVotes.indexOf(ownerId);
      if (ownerIdx > -1) {
        reply.upVotes.splice(ownerIdx, 1);
      }
    } else {
      // add user to the top of the upvotes array
      reply.upVotes.unshift(ownerId);
    }
    await reply.updateOne({
      _id: replyId,
      $push: { upVotes: ownerId },
    });
    return responseHandler(
      res,
      200,
      {
        commentId: commentId,
        replyId: replyId,
        numOfVotes: reply.downVotes.length + reply.upVotes.length + 1,
        numOfdownVotes: reply.downVotes.length,
        numOfupVotes: reply.upVotes.length + 1,
      },
      "Reply downvoted successfully"
    );
  } catch (error) {
    return next(new CustomError(500, "Something went wrong, try again", error));
  }
};

module.exports = updateSingleReplyUpVotes;
