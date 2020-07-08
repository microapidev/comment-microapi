const Comments = require("../../models/comments");
const { ObjectId } = require("mongoose").Types;

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const commentHandler = require("../../utils/commentHandler");

/**
 * @author Adepoju Adeyemi Joshua <adepojuadeyemi11@gmail.com>
 *
 * Deletes a single comment.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const deleteSingleComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  const ownerId = req.body.ownerId;
  const { applicationId } = req.token;

  if (!ObjectId.isValid(applicationId))
    return next(new CustomError(401, "unauthorised request"));
  if (!ObjectId.isValid(commentId))
    return next(new CustomError(404, "Comment not found"));
  if (!ownerId) return next(new CustomError(422, "invalid reply id"));

  try {
    //find comment in application
    const comment = await Comments.findOneAndDelete({
      _id: commentId,
      applicationId: applicationId,
    });
    if (!comment) {
      return next(new CustomError(404, "Comment not found"));
    }
    //const deleting = await Comments.findByIdAndDelete(commentId);
    return responseHandler(
      res,
      200,
      commentHandler(comment),
      "Comment successfully deleted"
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = deleteSingleComment;
