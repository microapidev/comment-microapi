const Comments = require("../../models/comments");
const mongoose = require("mongoose");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const commentHandler = require("../../utils/commentHandler");

/**
 * @author
 *
 * Gets a single comment
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getSingleComment = async (req, res, next) => {
  // const { refId } = req.query;
  const commentId = req.params.commentId;
  const { applicationId } = req.token; //this will be retrieved from decoded api token after full auth implementation
  const query = { _id: commentId, applicationId: applicationId };
  // if (refId) query.refId = refId;
  try {
    // check if commentId is valid
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return next(new CustomError(422, "invalid ID"));
    }

    const comment = await Comments.findOne(query);
    if (!comment) {
      return next(
        new CustomError(
          404,
          `Comment with the ID ${commentId} doesn't exist or has been removed`
        )
      );
    }

    return responseHandler(
      res,
      200,
      commentHandler(comment),
      `Comment Retrieved Successfully`
    );
  } catch (err) {
    return next(new CustomError(500, `Something went wrong ${err}`));
  }
};

module.exports = getSingleComment;
