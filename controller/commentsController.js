// UNCOMMENT EACH MODEL HERE AS NEEDED

const Comments = require("../models/comments");
//const Replies = require("../models/replies");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");
const Applications = require("../models/applications");

exports.upvoteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { ownerId } = req.body;
    let isUpvoted = false;

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
      isUpvoted = true;
    }

    //save the comment vote
    comment.save();

    //get total number of elements in array
    const totalUpVotes = comment.upVotes.length;
    const totalDownVotes = comment.downVotes.length;

    //get total number of votes
    const totalVotes = totalUpVotes + totalDownVotes;

    //Check the comment vote state
    const message = isUpvoted
      ? "Comment upvote added successfully!"
      : "Comment upvote removed successfully!";

    const data = {
      commentId: comment._id,
      numOfVotes: totalVotes,
      numOfUpVotes: totalUpVotes,
      numOfDownVotes: totalDownVotes,
    };
    return responseHandler(res, 200, data, message);
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
    let isDownvoted = false;

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
      isDownvoted = true;
    }

    //save the comment vote
    comment.save();

    //get total number of elements in array
    const totalUpVotes = comment.upVotes.length;
    const totalDownVotes = comment.downVotes.length;

    //get total number of votes
    const totalVotes = totalUpVotes + totalDownVotes;

    //Check the comment vote state
    const message = isDownvoted
      ? "Comment downvote added successfully!"
      : "Comment downvote removed successfully!";

    const data = {
      commentId: comment._id,
      numOfVotes: totalVotes,
      numOfUpVotes: totalUpVotes,
      numOfDownVotes: totalDownVotes,
    };
    return responseHandler(res, 200, data, message);
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
      return next(new CustomError(422, "invalid ID"));
    }
    const comment = await Comments.findOne({
      _id: commentId,
    });

    if (!comment) {
      return next(
        new CustomError(
          404,
          `Comment with the ID ${commentId} doesn't exist or has been deleted`
        )
      );
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
    return next(error);
  }
};

//$and:[{ $gte: [ "$flags", Number(2) ] }]

// issue#114_airon begins
exports.getComments = async (req, res, next) => {
  const { applicationId } = req.token; //this will be retrieved from decoded api token after full auth implementation
  console.log(applicationId);
  const { refId, origin, ownerId, isFlagged } = req.query;
  let query = {};
  if (refId) query.refId = refId;
  if (origin) query.commentOrigin = origin;
  if (ownerId) query.ownerId = ownerId;
  try {
    await Comments.find()
      .populate("replies")
      .then((comments) => {
        const allComments = comments.map((comment) => {
          return {
            commentId: comment._id,
            refId: comment.refId,
            //applicationId: comment.applicationId,
            ownerId: comment.ownerId,
            content: comment.content,
            origin: comment.origin,
            numOfVotes: comment.upVotes.length + comment.downVotes.length,
            numOfUpVotes: comment.upVotes.length,
            numOfDownVotes: comment.downVotes.length,
            numOfFlags: comment.flags.length,
            numOfReplies: comment.replies.length,
            // createdAt: comment.createdAt,
            // updatedAt: comment.updatedAt,
          };
        });

        const flaggedComments = [];
        allComments.forEach((comments) => {
          if (comments.numOfFlags > 0) {
            return flaggedComments.push(comments);
          }
        });

        const unflaggedComments = [];
        allComments.forEach((comments) => {
          if (comments.numOfFlags == 0) {
            return unflaggedComments.push(comments);
          }
        });

        // This logic is used to handle the optional isFlagged paramter
        let data = allComments;
        if (isFlagged === "true") data = flaggedComments;
        if (isFlagged === "false") data = unflaggedComments;

        responseHandler(
          res,
          200,
          data,
          `Comments Retrieved Successfully, query: ${JSON.stringify(req.query)}`
        );
      })
      .catch(next);
  } catch (err) {
    return next(new CustomError(401, `Something went wrong ${err}`));
  }
};
// issue#114_airon ends

//create and save a comment
exports.create = async (req, res, next) => {
  //validate request
  //extra check to make sure the application id exists in the db
  try {
    await Applications.findById(req.body.applicationId);
  } catch (err) {
    return next(new CustomError(400, "Invalid application id"));
  }
  //create a new comment
  const comment = new Comments({
    refId: req.body.refId,
    applicationId: req.body.applicationId,
    ownerId: req.body.ownerId,
    content: req.body.content,
    origin: req.body.origin,
  });
  //save comment
  try {
    const savedComment = await comment.save();
    return responseHandler(res, 200, savedComment);
  } catch (err) {
    return next(
      new CustomError(
        500,
        "Something went wrong, please try again",
        err.message
      )
    );
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
        next(new CustomError(404, "Comment not found"));
      } else if (comment.ownerId !== ownerId) {
        next(
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
    if (comment.ownerId === ownerId) {
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
    return next(error);
  }
};

exports.getCommentVotes = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { voteType } = req.query;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return next(new CustomError(404, "invalid ID"));
    }
    const comment = await Comments.findOne({
      _id: commentId,
    });
    if (!comment) {
      return next(
        new CustomError(
          404,
          `Comment with the ID ${commentId} doesn't exist or has been removed`
        )
      );
    }

    // votes array to store totalVotes, and also store upvotes or downvotes
    const votes = [];

    if (voteType !== "upvote" && voteType !== "downvote") {
      // Insert both upvotes and downvotes
      votes.push(...comment.upVotes);
      votes.push(...comment.downVotes);
    } else {
      // Insert upvotes only
      if (voteType === "upvote") {
        votes.push(...comment.upVotes);
      }
      if (voteType === "downvote") {
        // Insert downvotes only
        votes.push(...comment.downVotes);
      }
    }

    const data = {
      commentId,
      votes,
    };

    return responseHandler(
      res,
      200,
      data,
      "Comment Votes Retrieved Successfully"
    );
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong, Try again later", err)
    );
  }
};
exports.getSingleComment = async (req, res, next) => {
  // const { refId } = req.query;
  const commentId = req.params.commentId;
  const applicationId = req.headers.token; //this will be retrieved from decoded api token after full auth implementation
  const query = { applicationId: applicationId, _id: commentId };
  // if (refId) query.refId = refId;
  try {
    await Comments.find(query)
      .then((comments) => {
        const comment = comments.map((comment) => {
          return {
            commentId: comment._id,
            refId: comment.refId,
            applicationId: comment.applicationId,
            ownerId: comments.ownerId,
            content: comment.content,
            origin: comment.origin,
            numOfVotes: comment.upVotes.length + comment.downVotes.length,
            numOfUpVotes: comment.upVotes.length,
            numOfDownVotes: comment.downVotes.length,
            numOfFlags: comment.flags.length,
            numOfReplies: comment.replies.length,
            // createdAt: comment.createdAt,
            // updatedAt: comment.updatedAt,
          };
        });
        responseHandler(res, 200, comment, `Comment Retrieved Successfully`);
      })
      .catch((err) => {
        return next(
          new CustomError(500, "Something went wrong, please try again", err)
        );
      });
  } catch (err) {
    return next(new CustomError(401, `Something went wrong ${err}`));
  }
};
