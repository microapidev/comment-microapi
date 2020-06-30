// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");
const Comments = require("../models/comments");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");

const validate = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    new CustomError(422, "invalid ID");
    return;
  }
};

exports.upvoteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { ownerId } = req.body;

    validate(commentId);
    const comment = await Comments.findById({ _id: commentId });
    comment.vote = comment.vote + 1;
    const commentResponse = comment.upVotes.includes(ownerId)
      ? "Your upvote has already been registered"
      : comment.upVotes.unshift(ownerId);
    return res.json({
      message: "Comment upVoted Successfully!",
      response: "Ok",
      data: commentResponse,
    });
  } catch (err) {
    CustomError(err, res);
  }
};

exports.flagComment = async (req, res, next) => {
  try {
    //validation should be done via middleware
    //ownerId in body also needs to be validated

    const { commentId } = req.params;
    const { ownerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      next(new CustomError(422, "invalid ID"));
      return;
    }
    const comment = await Comments.findOne({
      _id: commentId,
    });

    if (!comment) {
      next(
        new CustomError(
          404,
          `Comment with the ID ${commentId} doesn't exist or has been deleted`
        )
      );
      return;
    }

    //flag comment by pushing ownerId into flags array
    if (!comment.flags.includes(ownerId)) {
      comment.flags.push(ownerId);
    }

    const data = {
      commentId: comment._id,
      numOfFlags: comment.flags.length,
    };

    responseHandler(res, 200, data, "Comment has been flagged successfully");
  } catch (error) {
    next(error);
  }
};
