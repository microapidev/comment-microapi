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

const createReply = async (req, res, next) => {
  const { body, ownerName, ownerEmail } = req.body;
  const { commentId } = req.params;

  if (!ObjectId.isValid(commentId)) {
    return next(new CustomError(400, " Invalid comment Id "));
  }

  if (!body || !ownerName || ownerEmail) {
    return res.status(422).json({
      status: "422 Error",
      message: "Enter the required fields",
      data: [],
    });
  }

  try {
    const reply = new Replies({
      body,
      ownerName,
      ownerEmail,
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
      return res.status(404).json({
        status: "404 Error",
        message: `Comment with the ID ${commentId} does not exist or has been deleted`,
        data: [],
      });
    }
    const totalVotes = savedReply.upVotes.length + savedReply.downVotes.length;
    return res.status(201).json({
      message: "Reply added successfully",
      response: "201 Created",
      data: [
        {
          replyId: savedReply._id,
          commentId: savedReply.commentId,
          body: savedReply.body,
          ownerEmail: savedReply.ownerEmail,
          ownerName: savedReply.ownerName,
          isFlagged: savedReply.isFlagged,
          upVotes: savedReply.upVotes,
          downVotes: savedReply.downVotes,
          totalVotes,
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentReplies,
  createReply,
};
