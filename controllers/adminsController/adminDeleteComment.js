const Comments = require("../../models/comments");
const Applications = require("../../models/applications");
const { ObjectId } = require("mongoose").Types;

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const commentHandler = require("../../utils/commentHandler");

/**
 * @author David Okanlawon
 *
 * Deletes a single comment.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const adminDeleteComment = async (req, res, next) => {
  const commentId = req.body.commentId;
  const { organizationId } = req.token;

  if (!ObjectId.isValid(organizationId))
    return next(new CustomError(401, "unauthorised request"));

  try {
    //find comment
    const comment = await Comments.findById(commentId);
    if (!comment) {
      return next(new CustomError(404, "Comment not found"));
    }

    if (comment.flags.length === 0) {
      return next(new CustomError(400, "You can only delete flagged comments"));
    }

    //get applicaitonId of comment find out if it belongs to organization
    const application = await Applications.findOne({
      _id: comment.applicationId,
      organizationId: organizationId,
    });

    if (!application) {
      return next(new CustomError(404, "Invalid comment or comment not found"));
    }

    // delete the comment
    const deletedComment = await Comments.findByIdAndDelete(commentId);

    return responseHandler(
      res,
      200,
      commentHandler(deletedComment),
      "Comment successfully deleted"
    );
  } catch (error) {
    return next(new CustomError(500, "A server error has occured"));
  }
};

module.exports = adminDeleteComment;
