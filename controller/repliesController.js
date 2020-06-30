// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require("../models/replies");
const Comments = require("../models/comments");
const { ObjectId } = require("mongoose").Types;

const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");

const getCommentReplies = async (req, res, next) => {
  const { commentId } = req.params;

  if (!ObjectId.isValid(commentId)) {
    return next(new CustomError(400, " Invalid comment Id "));
  }
  try {
    //check if such comment exists
    const comment = await Comments.findById(commentId);
    // If the comment does not exist,send an error msg
    if (!comment) {
      return next(new CustomError(404, " Comment not found "));
    }

    const replies = await Replies.find({ commentId: commentId }).populate(
      "replyOwner"
    );
    let message = " Replies found. ";
    if (!replies.length) {
      message = " No replies found. ";
    }
    return responseHandler(res, 200, replies, message);
  } catch (err) {
    next(err);
  }
};
// GET a single reply
const getASingleReply = async (req, res, next) => {
  const { commentId, replyId } = req.params;

  if (!ObjectId.isValid(commentId)) {
    return next(new CustomError(400, " Invalid comment Id "));
  }
  if (!ObjectId.isValid(replyId)) {
    return next(new CustomError(400, " Invalid reply Id "));
  }
  try {
    //check if such comment exists
    const comment = await Comments.findById(commentId);
    // If the comment does not exist,send an error msg
    if (!comment) {
      return next(new CustomError(404, " Comment not found "));
    }
    const reply = await Replies.findOne({
      $and: [{ commentId }, { _id: replyId }],
    });
    if (!reply) {
      return next(new CustomError(404, " Reply not found "));
    }
    return responseHandler(res, 200, reply, " Reply found ");
  } catch (err) {
    next(
      new CustomError(500, " Something went wrong, please try again later,err")
    );
  }
};

const createReply = async (req, res, next) => {
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

const getReplyVotes = async (req, res, next) => {
  try {
    const { commentId, replyId } = req.params;
    const { voteType } = req.query;

    if (!ObjectId.isValid(commentId)) {
      return next(new CustomError(404, "Invalid ID"));
    }

    if (!ObjectId.isValid(replyId)) {
      return next(new CustomError(404, "Invalid ID"));
    }

    const parentComment = await Comments.findById(commentId);

    // Check to see if the parent comment exists.
    if (!parentComment) {
      return next(
        new CustomError(
          404,
          `Comment with the ID ${commentId} does not exist or has been deleted`
        )
      );
    }

    const reply = await Replies.findById(replyId);

    // Check to see if the reply exists.
    if (!reply) {
      return next(
        new CustomError(
          404,
          `Reply with the ID ${replyId} does not exist or has been deleted`
        )
      );
    }

    // A list of all the votes
    const votes = [];

    if (!voteType) {
      // Add all votes
      votes.push(...reply.upVotes);
      votes.push(...reply.downVotes);
    } else {
      if (voteType === "upvote") {
        // Add upvotes only
        votes.push(...reply.upVotes);
      }

      if (voteType === "downvote") {
        // Add downvotes only
        votes.push(...reply.downVotes);
      }
    }

    // The data object to be returned in the response
    const data = {
      replyId,
      commentId,
      votes,
    };

    return responseHandler(res, 200, data, "OK");
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

module.exports = {
  getCommentReplies,
  getASingleReply,
  createReply,
  getReplyVotes,
};
