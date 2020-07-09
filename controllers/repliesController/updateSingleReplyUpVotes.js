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

    if (reply.upVotes.includes(ownerId)) {
      return next(new CustomError(409, "You've upvoted this reply already"));
    }
    if (reply.downVotes.includes(ownerId)) {
      return next(
        new CustomError(
          409,
          "You've already downvoted this reply, You can't upvote"
        )
      );
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
      "Reply Upvoted successfully"
    );
  } catch (error) {
    return next(new CustomError(500, "Something went wrong, try again", error));
  }
};

module.exports = updateSingleReplyUpVotes;
