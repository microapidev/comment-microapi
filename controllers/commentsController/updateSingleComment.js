// Models
const Comments = require("../../models/comments");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author Hemen Lan <lihemen@yahoo.com>
 *
 * Updates a single comment.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const updateSingleComment = async (req, res, next) => {
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

module.exports = updateSingleComment;
