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
    const { applicationId } = req.token;

    if (!ObjectId.isValid(commentId)) {
      next(new CustomError(404, "invalid ID"));
      return;
    }

    if (!ownerId || !content) {
      next(new CustomError(422, `Enter the required fields`));
      return;
    }

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

    const reply = new Replies({
      content,
      ownerId,
      commentId,
    });

    const savedReply = await reply.save();

    //add reply to comment
    parentComment.replies.push(reply);
    await parentComment.save();

    const data = {
      replyId: savedReply._id,
      commentId: savedReply.commentId,
      content: savedReply.content,
      ownerId: savedReply.ownerId,
      upVotes: savedReply.upVotes.length,
      downVotes: savedReply.downVotes.length,
      flags: savedReply.flags.length,
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
