// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");

const Comments = require("../models/comments");
// const User = require("../models/users");
const errHandler = require("../utils/errorhandler");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
const { default: responseHandler } = require("../utils/responseHandler");

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

exports.getUnflaggedComments = (req, res, next) => {
  Comments.find({ isFlagged: false })
    .select(
      "_id replies upVotes downVotes commentBody commentOrigin commentOwner createdAt updatedAt"
    )
    .exec()
    .then((comments) => {
      if (!comments || comments.length < 1) {
        return next(new CustomError(404, "No unflagged comments found"));
      } else {
        let message = "Comments found";
        return responseHandler(res, 200, comments, message);
      }
    })
    .catch((err) => {
      return next(
        new CustomError(
          500,
          "Oops, something went wrong, please try againg",
          err
        )
      );
    });
};
