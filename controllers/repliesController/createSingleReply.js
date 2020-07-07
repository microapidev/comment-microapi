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
 * Creates a single reply.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const createSingleReply = async (req, res, next) => {
  try {
    //validation should be done via middleware
    //ownerId in body also needs to be validated

    const { ownerId, content } = req.body;
    const { commentId } = req.params;

    if (!ObjectId.isValid(commentId)) {
      next(new CustomError(404, "invalid ID"));
      return;
    }

    if (!ownerId || !content) {
      next(new CustomError(422, `Enter the required fields`));
      return;
    }
    const reply = new Replies({
      content,
      ownerId,
      commentId,
    });

    const savedReply = await reply.save();
    const parentComment = await Comments.findByIdAndUpdate(
      commentId,
      {
        $push: {
          replies: savedReply._id,
        },
      },
      {
        new: true,
      }
    );
    if (!parentComment) {
      next(
        new CustomError(
          404,
          `Comment with the ID ${commentId} does not exist or has been deleted`
        )
      );
      return;
    }
    const data = {
      replyId: savedReply._id,
      commentId: savedReply.commentId,
      content: savedReply.content,
      ownerId: savedReply.ownerId,
      upVotes: savedReply.upVotes,
      downVotes: savedReply.downVotes,
      flags: savedReply.flags,
    };

    responseHandler(res, 201, data, "Reply added successfully");
    return;
  } catch (error) {
    next(
      new CustomError(
        500,
        "Something went wrong, please try again later",
        error
      )
    );
    return;
  }
};

module.exports = createSingleReply;
