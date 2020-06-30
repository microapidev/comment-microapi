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

exports.deleteComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  const ownerId = req.body.ownerId;
  try {
    const comment = await Comments.findOne({ _id: commentId })
    if (!comment) {
      return next(new CustomError(400, "Comment not found"));
    }
    if (comment.ownerId == ownerId) {
      const deleting = await Comments.findByIdAndDelete(commentId);
      if (deleting) {
        return responseHandler(
          res,
          200,
          deleting,
          "Comment deleted successfully"
        );
      } else {
        return next(
          new CustomError(
            400,
            "Cannot delete your comment at this time. Please try again"
          )
        );
      }
    } else {
      return next(
        new CustomError(
          400,
          "Comment cannot be deleted because you are not the owner of this comment."
        )
      );
    }
  } catch (error) {
    return next(
      new CustomError(500, "Something went wrong,please try again", error)
    );
  }
};
