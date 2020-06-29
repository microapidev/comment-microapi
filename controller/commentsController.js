// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");

const Comments = require("../models/comments");
const User = require("../models/users");
const errHandler = require("../utils/errorhandler");
const mongoose = require("mongoose");

exports.voteComment = async (req, res) => {
  try {
    const id = req.params.commentId;
    console.log(id);
    const { voteType, email } = req.body;
    const comment = await Comments.findById({ _id: id });
    console.log(comment);
    if (voteType === "upvote") comment.totalVotes = comment.totalVotes + 1;
    const total = comment.totalVotes;
    comment.voteType = voteType;
    const userData = await User.findOne({ email });
    console.log(userData);
    if (voteType === "upvote") comment.upVotes.push(userData);
    if (voteType === "downvote") comment.downVotes.push(userData);
    comment.save();
    const data = {
      commentId: id,
      total_votes: total,
      upVotes: comment.upVotes,
      downVotes: comment.downVotes,
    };
    res.json({
      message: "Comment Voted Successfully!",
      response: "Ok",
      data: data,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
      data: [],
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
