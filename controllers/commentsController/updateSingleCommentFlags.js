const mongoose = require("mongoose");

// Models
const Comments = require("../../models/comments");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author Jimoh Rildwan Adekunle <jemohkunle2007@gmail.com>
 *
 * Updates a single comment's flags through a toggle functionality.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const updateSingleCommentFlags = async (req, res, next) => {
  try {
    //validation should be done via middleware
    //ownerId in body also needs to be validated

    const { commentId } = req.params;
    const { ownerId } = req.body;
    const { applicationId } = req.token;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return next(new CustomError(422, "Invalid ID Error"));
    }
    const comment = await Comments.findOne({
      _id: commentId,
      applicationId: applicationId,
    });

    if (!comment) {
      return next(
        new CustomError(
          404,
          `Comment with the ID ${commentId} doesn't exist or has been deleted`
        )
      );
    }

    if (
      !ownerId.match(/\S+@\S+\.\S+/) ||
      ownerId.indexOf(" ") != -1 ||
      0 === ownerId.length
    ) {
      return next(new CustomError(404, "Validation Error"));
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

module.exports = updateSingleCommentFlags;
