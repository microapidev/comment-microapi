// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");

const Comments = require("../models/comments");
// const User = require("../models/users");
const errHandler = require("../utils/errorhandler");
const mongoose = require("mongoose");

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

//find coments by this user
//check for the id of the comment is by the user before deleting
exports.deleteComment = (req, res) => {
  const commentId = req.query.commentId;
  const userId = req.params.userId;
  Comments.find({ commentOwner: userId, _id: commentId })
    .then((comment) => {
      if (comment.length) {
        Comments.findByIdAndDelete(commentId).then((success) => {
          if (!success) {
            return res.status(400).json({
              status: false,
              message:
                "Canot delete your comment at this time. Please try again",
            });
          } else {
            return res.status(200).json({
              status: true,
              message: "Comment deleted successfully",
            });
          }
        });
      } else {
        return res.status(400).json({
          status: false,
          message:
            "Comment cannot be deleted because you are not the owner of this comment.",
        });
      }
    })
    .catch((err) => console.log(err));
};
