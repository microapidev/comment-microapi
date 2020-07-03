// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require("../models/replies");
const Comments = require("../models/comments");
const { ObjectId } = require("mongoose").Types;

const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");

//GET Replies to a comment
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

// POST a new reply
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

// Updates a reply
const updateReply = async (req, res, next) => {
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

//PATCH upvote a reply
const upvoteReply = async (req, res, next) => {
  const commentId = req.params.commentId;
  const replyId = req.params.replyId;
  const voterId = req.body.voterId;

  try {
    let comment = await Comments.findById(commentId);
    if (!comment) {
      return next(new CustomError(404, "Comment not found or deleted"));
    }
    let reply = await Replies.findById(replyId);
    if (!reply) {
      return next(new CustomError(404, "Reply not found or deleted"));
    }

    if (reply.downVotes.includes(voterId)) {
      const voterIndex = reply.downVotes.indexOf(voterId);
      //if index exists
      if (voterIndex > -1) {
        //delete that index
        reply.downVotes.splice(voterIndex, 1);
      }
    }
    if (reply.upVotes.includes(voterId)) {
      const voterIdx = reply.upVotes.indexOf(voterId);
      if (voterIdx > -1) {
        reply.upVotes.splice(voterIdx, 1);
      }
    } else {
      // add user to the top of the upvotes array
      reply.upVotes.unshift(voterId);
    }
    await reply.updateOne({
      _id: replyId,
      $push: { upVotes: voterId },
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

//PATCH downvote a reply
const downvoteReply = async (req, res, next) => {
  const commentId = req.params.commentId;
  const replyId = req.params.replyId;
  const voterId = req.body.voterId;

  try {
    let comment = await Comments.findById(commentId);
    if (!comment) {
      return next(new CustomError(404, "Comment not found or deleted"));
    }
    let reply = await Replies.findById(replyId);
    if (!reply) {
      return next(new CustomError(404, "Reply not found or deleted"));
    }
    if (reply.upVotes.includes(voterId)) {
      return next(
        new CustomError(409, "You've upvoted this reply, you can't downvote")
      );
    }
    if (reply.downVotes.includes(voterId)) {
      return next(new CustomError(409, "You've already downvoted this reply"));
    }
    await reply.updateOne({
      _id: replyId,
      $push: { downVotes: voterId },
    });
    return responseHandler(
      res,
      200,
      {
        commentId: commentId,
        replyId: replyId,
        numOfVotes: reply.downVotes.length + reply.upVotes.length + 1,
        numOfUpvotes: reply.upVotes.length,
        numOfDownvotes: reply.downVotes.length + 1,
      },
      "Reply downvoted successfully"
    );
  } catch (error) {
    return next(new CustomError(500, "Something went wrong, try again", error));
  }
};

//GET Replies votes
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

//PATCH Flag Replies
const flagCommentReplies = async (req, res, next) => {
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

//DELETE Reply
const deleteCommentReply = async (req, res, next) => {
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

//Export methods
module.exports = {
  getCommentReplies,
  getASingleReply,
  createReply,
  updateReply,
  upvoteReply,
  downvoteReply,
  getReplyVotes,
  flagCommentReplies,
  deleteCommentReply,
};
