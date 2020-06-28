// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");

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

//create and save a comment
exports.create = async (req, res) => {
  //validate request
  //check if the commenting user exists before saving the comment in the db
  const userCommenting = await User.findOne({
    email: req.body.commentOwnerEmail,
  });
  //if user exists in the db save the comment
  if (userCommenting) {
    const commentingUserId = userCommenting._id;
    //create a new comment
    const comment = new Comments({
      refId: req.body.refId,
      commentBody: req.body.commentBody,
      commentOrigin: req.body.commentOrigin,
      commentOwner: commentingUserId,
    });
    //save comment in our db
    try {
      const savedComment = await comment.save();
      res.send(savedComment);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else {
    //create user,save the user then save the user's comment to db
    const user = new User({
      name: req.body.commentOwnerName,
      email: req.body.commentOwnerEmail,
    });
    try {
      const savedUser = await user.save();
    } catch (err) {
      res.status(500).send(err.message);
    }
    //get the id of the user we've just saved to db and save their comment
    const justSavedUser = await User.findOne({
      email: req.body.commentOwnerEmail,
    });
    const commentingUserId = justSavedUser._id;
    //create a new comment
    const comment = new Comments({
      refId: req.body.refId,
      commentBody: req.body.commentBody,
      commentOrigin: req.body.commentOrigin,
      commentOwner: commentingUserId,
    });
    //save comment in our db
    try {
      const savedComment = await comment.save();
      res.send(savedComment);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};
