// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");
const Comments = require("../models/comments");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
// const User = require("../models/users");
const responseHandler = require("../utils/responseHandler");

exports.upvoteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { ownerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      next(new CustomError(422, "invalid ID"));
      return;
    }
    const comment = await Comments.findById({ _id: commentId });

    //if user exists in downvotes array
    if (comment.downVotes.includes(ownerId)) {
      //get index of user in downvotes array
      const voterIndex = comment.downVotes.indexOf(ownerId);
      //if index exists
      if (voterIndex > -1) {
        //delete that index
        comment.downVotes.splice(voterIndex, 1);
      }
    }

    //same as above for upvotes
    if (comment.upVotes.includes(ownerId)) {
      const voterIdx = comment.upVotes.indexOf(ownerId);
      if (voterIdx > -1) {
        comment.upVotes.splice(voterIdx, 1);
      }
    } else {
      // add user to the top of the upvotes array
      comment.upVotes.unshift(ownerId);
    }

    //save the comment vote
    comment.save();

    //get total number of elements in array
    const totalUpVotes = comment.upVotes.length;
    const totalDownVotes = comment.downVotes.length;

    //get total number of votes
    const totalVotes = totalUpVotes + totalDownVotes;

    const data = {
      commentId: comment._id,
      numOfVotes: totalVotes,
      numOfUpVotes: totalUpVotes,
      numOfDownVotes: totalDownVotes,
    };
    return responseHandler(res, 200, data, "Comment upVoted Successfully!");
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong, please try again later", err)
    );
  }
};

exports.downvoteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { ownerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      next(new CustomError(422, "invalid ID"));
      return;
    }
    const comment = await Comments.findById({ _id: commentId });
    if (!comment) {
      return next(new CustomError(404, "Comment Id not found"));
    }
    //if user exists in upvotes array
    if (comment.upVotes.includes(ownerId)) {
      //get index of user in upvotes array
      const voterIndex = comment.upVotes.indexOf(ownerId);
      //if index exists
      if (voterIndex > -1) {
        //delete that index
        comment.upVotes.splice(voterIndex, 1);
      }
    }

    //same as above for downvotes
    if (comment.downVotes.includes(ownerId)) {
      const voterIdx = comment.downVotes.indexOf(ownerId);
      if (voterIdx > -1) {
        comment.downVotes.splice(voterIdx, 1);
      }
    } else {
      // add user to the top of the downvotes array
      comment.downVotes.unshift(ownerId);
    }

    //save the comment vote
    comment.save();

    //get total number of elements in array
    const totalUpVotes = comment.upVotes.length;
    const totalDownVotes = comment.downVotes.length;

    //get total number of votes
    const totalVotes = totalUpVotes + totalDownVotes;

    const data = {
      commentId: comment._id,
      numOfVotes: totalVotes,
      numOfUpVotes: totalUpVotes,
      numOfDownVotes: totalDownVotes,
    };
    return responseHandler(res, 200, data, "Comment downVoted Successfully!");
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong, please try again later", err)
    );
  }
};

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

exports.getCommentVote = async (req, res, next) => {
  const commentId = req.params.commentId;
  const ownerId = req.body.ownerId;
  try {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return next(new CustomError(422, "invalid ID"));
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
    } else {
      // get comment vote
      if (comment.ownerId === ownerId) {
        if (comment.upVote.includes(ownerId)) {
          if (comment.downVotes.includes(ownerId)) {
            const totalVotes =
              comment.upVotes.length + comment.downVotes.length;
            const data = {
              commentId: comment._id,
              numOfVotes: totalVotes,
            };
            responseHandler(res, 200, data, "get comment Vote successfully");
          }
        }
      }
    }
  } catch (err) {
    return next(new CustomError(400, "No Vote under this specific comment"));
  }
};
