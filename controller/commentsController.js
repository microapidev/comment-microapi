// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");
const Comments = require("../models/comments");
const Replies = require("../models/replies");
const Users = require("../models/users");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");

exports.flagComment = async (req, res, next) => {
  try {
    //validation should be done via middleware
    //ownerId in body also needs to be validated

    const { commentId } = req.params;
    const { ownerId } = req.body;

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

// issue#114_airon begins
exports.getComments = async (req, res, next) => {
  const applicationId = "expenseng"; //this will be retrieved from api token
  const { refId, origin, ownerId, isFlagged } = req.query;
  let query = {};
  if (refId) query.refId = refId;
  if (origin) query.commentOrigin = origin;
  if (ownerId) query.commentOwner = ownerId;
  if (isFlagged) query.isFlagged = JSON.parse(isFlagged);
  try {
    await Comments.find(query)
      .populate("replies")
      .populate("users")
      .then((comments) => {
        res.status(200).json({
          status: "success",
          message: `Comments Retrieved Successfully for ${applicationId}/${refId}`,
          query: query,
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
// issue#114_airon ends

// Nothing is happening here for now - just to avoid lint errors
exports.unusedMethod = async () => {
  let user = new Users({});
  let reply = new Replies({});
  user.save();
  reply.save();
};
