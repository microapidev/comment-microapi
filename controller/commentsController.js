// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");
const Comments = require("../models/comments");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
// const User = require("../models/users");
const errHandler = require("../utils/errorhandler");
const responseHandler = require("../utils/responseHandler");

exports.flagComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comments.findOneAndUpdate(
      {
        _id: commentId,
      },
      {
        isFlagged: true,
        $inc: {
          numOfFlags: 1,
        },
      },
      {
        new: true,
      }
    );
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(422).json({
        status: "error",
        response: "422 error",
        message: "Invalid ID",
      });
    }
    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: `Comment with the ID ${commentId} doesn't exist or has been deleted`,
        data: null,
      });
    }
    return res.status(200).json({
      message: "Comment has been flagged successfully",
      response: "200 OK",
      data: {
        commentId: comment._id,
        isFlagged: comment.isFlagged,
        numOfflags: comment.numOfFlags,
      },
    });
  } catch (error) {
    errHandler(error, res);
  }
};

exports.deleteComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  const userEmail = req.body.commentOwnerEmail;
  try {
    const comment = await Comments.findOne({ _id: commentId }).populate(
      "commentOwner"
    );
    if (!comment) {
      return next(new CustomError(400, "Comment not found"));
    }
    const email = await comment;
    if (email.commentOwner.email.toLowerCase() == userEmail.toLowerCase()) {
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
