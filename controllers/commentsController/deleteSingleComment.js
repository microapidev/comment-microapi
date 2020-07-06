const Comments = require("../../models/comments");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

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

module.exports = deleteSingleComment;
