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
    // console.log(`applicationId: ${req.token.applicationId}`);

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
  const content = req.body.content;
  const ownerId = req.body.ownerId;

  Comments.findById(comment_id)
    .exec()
    .then((comment) => {
      if (!comment) {
        return next(new CustomError(404, "Comment not found"));
      } else if (comment.ownerId != ownerId) {
        return next(
          new CustomError(
            403,
            "Sorry, comment cannot be updated or Unauthorized"
          )
        );
      }
      Comments.updateOne(
        { _id: comment_id },
        { $set: { content: content, isEdited: true } }
      )
        .then(() => {
          return responseHandler(
            res,
            200,
            { content: content, ownerId: ownerId },
            "Updated sucessfully"
          );
        })
        .catch((err) => {
          return next(
            new CustomError(400, "Update failed, please try again", err)
          );
        });
    })
    .catch((err) => {
      return next(
        new CustomError(500, "Something went wrong, please try again", err)
      );
    });
};

exports.deleteComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  const ownerId = req.body.ownerId;
  try {
    const comment = await Comments.findOne({ _id: commentId });
    if (!comment) {
      return next(new CustomError(400, "Comment not found"));
    }
    if (comment.ownerId == ownerId) {
      const deleting = await Comments.findByIdAndDelete(commentId);
      if (deleting) {
        responseHandler(res, 200, deleting, "Comment deleted successfully");
        return;
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

exports.getSingleComment = async (req, res, next) => {
  const comment_id = req.params.commentId;

  try {
    let comment = await Comments.findById(comment_id);

    if (!comment) {
      return next(new CustomError(404, "Comment does not exist or not found"));
    } else {
      return responseHandler(res, 200, comment, "Comment found");
    }
  } catch (error) {
    return next(
      new CustomError(500, "Something went wrong, please try again", error)
    );
  }
};
