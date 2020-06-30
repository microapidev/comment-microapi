// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");
const Comments = require("../models/comments");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
// const User = require("../models/users");
const responseHandler = require("../utils/responseHandler");

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

exports.updateComment = async (req, res, next) => {
  const comment_id = req.params.commentId;
  const commentBody = req.body.content;
  const owner = req.body.ownerId;

  Comments.findById(comment_id)
    .exec()
    .then((comment) => {
      if (!comment) {
        return new CustomError(404, "Comment not found");
      } else if (comment.ownerId != owner) {
        return new CustomError(
          403,
          "Sorry, comment cannot be updated or Unauthorized"
        );
      }
      Comments.updateOne(
        { _id: comment_id },
        { $set: { commentBody: commentBody, isEdited: true } }
      )
        .then(() => {
          return responseHandler(
            res,
            200,
            { content: commentBody, ownerId: owner },
            "Updated sucessfully"
          );
        })
        .catch((err) => {
          return new CustomError(400, "Update failed, please try again", err);
        });
    })
    .catch((err) => {
      return next(
        new CustomError(500, "Something went wrong, please try again", err)
      );
    });
};
