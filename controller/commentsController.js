// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");
const Comments = require("../models/comments");
const mongoose = require("mongoose");
// const CustomError = require("../utils/customError");
// const User = require("../models/users");
const errHandler = require("../utils/errorhandler");

exports.flagComment = async (req, res) => {
  try {
    //validation should be done via middleware
    //ownerId in body also needs to be validated
    const { commentId } = req.params;
    const { ownerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(422).json({
        status: "error",
        response: "422 error",
        message: "Invalid ID",
      });
    }
    const comment = await Comments.findOne({
      _id: commentId,
    });

    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: `Comment with the ID ${commentId} doesn't exist or has been deleted`,
        data: null,
      });
    }

    //flag comment by pushing ownerId into flags array
    if (!comment.flags.includes(ownerId)) {
      comment.flags.push(ownerId);
    }

    return res.status(200).json({
      message: "Comment has been flagged successfully",
      response: "200 OK",
      data: {
        commentId: comment._id,
        numOfFlags: comment.flags.length,
      },
    });
  } catch (error) {
    errHandler(error, res);
  }
};
