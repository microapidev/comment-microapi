// Models
const Comments = require("../../models/comments");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author Airon <airondev@gmail.com>
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getAllComments = async (req, res, next) => {
  const applicationId = req.headers.token; //this will be retrieved from decoded api token after full auth implementation
  const { refId, origin, ownerId, isFlagged } = req.query;
  let query = { applicationId: applicationId };
  if (refId) query.refId = refId;
  if (origin) query.commentOrigin = origin;
  if (ownerId) query.ownerId = ownerId;
  try {
    await Comments.find(query)
      .then((comments) => {
        const allComments = comments.map((comment) => {
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

module.exports = getAllComments;
