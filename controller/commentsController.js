// UNCOMMENT EACH MODEL HERE AS NEEDED
const Replies = require("../models/replies");
const User = require("../models/users");
const Comments = require("../models/comments");
const errHandler = require("../utils/errorhandler");
const mongoose = require("mongoose");

// Nothing is happening here - just to avoid lint-errors (lolz)
exports.postDummyComment = async () => {
  let user = new User({});
  let reply = new Replies({});
  user.save();
  reply.save();
};

exports.getComments = async (req, res, next) => {
  try {
    await Comments.find({})
      .populate("replies")
      .populate("users")
      .then((comments) => {
        res.status(200).json({
          status: "success",
          message: `all comments retrieved for expense report `,
          data: comments,
        });
      })
      .catch(next);
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: `Something went wrong`,
      data: err,
    });
  }
};

exports.getFlaggedComments = async (req, res, next) => {
  try {
    await Comments.find({ isFlagged: true })
      .populate("replies")
      .populate("users")
      .then((comments) => {
        res.status(200).json({
          status: "success",
          message: `All flagged comments retrieved for expense report `,
          data: comments,
        });
      })
      .catch(next);
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: `Something went wrong`,
      data: err,
    });
  }
};

exports.getUnFlaggedComments = async (req, res, next) => {
  try {
    await Comments.find({ isFlagged: false })
      .populate("replies")
      .populate("users")
      .then((comments) => {
        res.status(200).json({
          status: "success",
          message: `Unflagged comments retrieved for expense report `,
          data: comments,
        });
      })
      .catch(next);
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: `Something went wrong`,
      data: err,
    });
  }
};

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
