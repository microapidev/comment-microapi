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
 * Deletes a single reply.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const deleteSingleReply = async (req, res, next) => {
  const { commentId, replyId } = req.params;
  const { ownerId } = req.body;
  if (!ObjectId.isValid(commentId))
    return next(new CustomError(422, "invalid comment id"));
  if (!ObjectId.isValid(replyId))
    return next(new CustomError(422, "invalid reply id"));

  try {
    const reply = await Replies.findOneAndDelete({
      ownerId,
      commentId,
      _id: replyId,
    });
    if (!reply) {
      return next(new CustomError(404, "reply not found"));
    }
    await Comments.findByIdAndUpdate(commentId, {
      // it doesn't matter if the parent exist or not
      $pull: { replies: replyId },
    });

    const { _id: dbReplyId, ...rest } = reply.toObject();

    return responseHandler(
      res,
      200,
      { replyId: dbReplyId, ...rest },
      "Reply successfully deleted"
    );
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong, please try again later", err)
    );
  }
};

module.exports = deleteSingleReply;
