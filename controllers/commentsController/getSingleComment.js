const Comments = require("../../models/comments");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

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
  //  const applicationId = req.headers.token; //this will be retrieved from decoded api token after full auth implementation
  const query = { _id: commentId };
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

module.exports = getSingleComment;
