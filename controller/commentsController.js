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

exports.updateComment = async (req, res, next) => {
  const comment_id = req.params.commentId;
  const commentBody = req.body.commentBody;
  if (!commentBody || commentBody.trim() == "") {
    return res.status(400).json({ message: "Invalid comment body" });
  }
  Comments.findById(comment_id)
    .exec()
    .then((comment) => {
      if (!comment) {
        return next(new CustomError(404, "Comment not found!!"));
      } else {
        Comments.updateOne(
          { _id: comment_id },
          { $set: { commentBody: commentBody, isEdited: true } }
        )
          .then(() => {
            return responseHandler(
              res,
              201,
              commentBody,
              "Updated successfully"
            );
          })
          .catch((err) => {
            return next(new CustomError(400, "Update failed, try again", err));
          });
      }
    })
    .catch((err) => {
      return next(new CustomError(500, "Something went wrong, try again", err));
    });
};
