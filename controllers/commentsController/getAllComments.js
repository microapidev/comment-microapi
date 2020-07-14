// Models
const Comments = require("../../models/comments");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author Airon <airondev@gmail.com>
 *
 * Gets all comments.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getAllComments = async (req, res, next) => {
  const { applicationId } = req.token; //this will be retrieved from decoded api token after full auth implementation
  const { refId, origin, ownerId, isFlagged, limit, offset, sort } = req.query;

  let query = {};
  let paginateOption = {};

  query.applicationId = applicationId;

  if (refId) query.refId = refId;
  if (origin) query.origin = origin;
  if (ownerId) query.ownerId = ownerId;
  if (limit) {
    paginateOption.limit = parseInt(limit, 10);
  }
  //set offset query condition
  offset
    ? (paginateOption.offset = parseInt(offset, 10))
    : (paginateOption.offset = 0);

  sort
    ? (paginateOption.sort = { createdAt: sort })
    : (paginateOption.sort = { createdAt: "desc" });

  if (typeof isFlagged === "string") {
    if (isFlagged === "true") {
      query["flags.0"] = { $exists: true };
    } else if (isFlagged === "false") {
      query["flags.0"] = { $exists: false };
    }
  }

  try {
    paginateOption.populate = "replies";
    await Comments.paginate(query, paginateOption)
      .then((comments) => {
        const allComments = comments.docs.map((comment) => {
          return {
            commentId: comment._id,
            refId: comment.refId,
            applicationId: comment.applicationId,
            ownerId: comment.ownerId,
            content: comment.content,
            origin: comment.origin,
            numOfVotes: comment.upVotes.length + comment.downVotes.length,
            numOfUpVotes: comment.upVotes.length,
            numOfDownVotes: comment.downVotes.length,
            numOfFlags: comment.flags.length,
            numOfReplies: comment.replies.length,
            createdAt: comment.createdAt.toString(),
            updatedAt: comment.updatedAt.toString(),
          };
        });

        let data = allComments;

        responseHandler(res, 200, data, `Comments Retrieved Successfully`);
      })
      .catch(next);
  } catch (err) {
    return next(new CustomError(401, `Something went wrong ${err}`));
  }
};

module.exports = getAllComments;
