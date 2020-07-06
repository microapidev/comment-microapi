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
 * Updates a single reply.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const updateSingleReply = async (req, res, next) => {
  const { commentId, replyId } = req.params;
  const { content, ownerId } = req.body;

  if (!ObjectId.isValid(commentId)) {
    return next(new CustomError(422, " Invalid comment ID"));
  }

  if (!ObjectId.isValid(replyId)) {
    return next(new CustomError(422, " Invalid reply ID"));
  }

  try {
    let comment = await Comments.findById(commentId);

    if (!comment) {
      return next(new CustomError(404, "Comment not found or deleted"));
    }

    let reply = await Replies.findById(replyId);

    if (!reply) {
      return next(new CustomError(404, "Reply not found or deleted"));
    }
    if (ownerId !== reply.ownerId) {
      return next(new CustomError(401, "Unauthorized ID"));
    }
    await reply.updateOne(
      { _id: replyId },
      { $set: { content: content, isEdited: true } }
    );

    return responseHandler(
      res,
      200,
      { content: content, ownerId: ownerId },
      "Updated sucessfully"
    );
  } catch (error) {
    return next(
      new CustomError(
        500,
        "Something went wrong, please try again later.",
        error
      )
    );
  }
};

module.exports = updateSingleReply;
