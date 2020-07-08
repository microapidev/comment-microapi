const { ObjectId } = require("mongoose").Types;

// Models
const Replies = require("../../models/replies");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author
 *
 * Updates a single reply's flags through a toggle functionality.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const updateSingleReplyFlags = async (req, res, next) => {
  try {
    //validation should be done via middleware
    //ownerId in body also needs to be validated

    const { commentId, replyId } = req.params;
    const { ownerId } = req.body;

    if (!ObjectId.isValid(commentId)) {
      return next(new CustomError(422, " Invalid comment Id "));
    }

    if (!ObjectId.isValid(replyId)) {
      return next(new CustomError(422, " Invalid reply Id "));
    }
    const reply = await Replies.findOne({
      _id: replyId,
      commentId: commentId,
    });

    if (!reply) {
      next(
        new CustomError(
          404,
          `Reply with the ID ${replyId} doesn't exist or has been deleted`
        )
      );
      return;
    }

    //flag comment reply by pushing ownerId into flags array
    if (!reply.flags.includes(ownerId)) {
      reply.flags.push(ownerId);
    } else {
      const index = reply.flags.indexOf(ownerId);
      reply.flags.splice(index, 1);
    }

    const data = {
      replyId: reply._id,
      commentId: reply.commentId,
      numOfFlags: reply.flags.length,
    };

    return responseHandler(
      res,
      200,
      data,
      "Reply has been flagged successfully"
    );
  } catch (error) {
    return next(
      new CustomError(
        500,
        "Something went wrong, please try again later",
        error
      )
    );
  }
};

module.exports = updateSingleReplyFlags;
