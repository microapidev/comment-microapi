// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require("../models/replies");
const Comments = require("../models/comments");
const User = require("../models/users");
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

exports.getComments = async (req, res, next) => {
  const origin = req.query.origin;
  try {
    await Comments.find({ commentOrigin: origin })
      .populate("replies")
      .populate("users")
      .then((comments) => {
        res.status(200).json({
          status: "success",
          message: `Comments Retrieved Successfully for ${origin}`,
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
  const origin = req.query.origin;
  try {
    await Comments.find({ commentOrigin: origin, isFlagged: true })
      .populate("replies")
      .populate("users")
      .then((comments) => {
        res.status(200).json({
          status: "success",
          message: `Flagged Comments Retrieved Successfully for ${origin}`,
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
  const origin = req.query.origin;
  try {
    await Comments.find({ commentOrigin: origin, isFlagged: false })
      .populate("replies")
      .populate("users")
      .then((comments) => {
        res.status(200).json({
          status: "success",
          message: `Unflagged Comments Retrieved Successfully for ${origin}`,
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

// Nothing is happening here for now - just to avoid lint errors
exports.unusedMethod = async () => {
  let user = new User({});
  let reply = new Replies({});
  user.save();
  reply.save();
};
