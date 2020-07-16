// Models
const Comments = require("../../models/comments");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author Airon <airondev@gmail.com>
 * @author Ekeyekwu Oscar
 *
 * Gets all comments.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getAllComments = async (req, res, next) => {
  const { applicationId } = req.token; //this will be retrieved from decoded api token after full auth implementation
  const { refId, origin, ownerId, isFlagged, limit, sort, page } = req.query;

  let query = {};
  let paginateOptions = {};

  query.applicationId = applicationId;

  if (refId) query.refId = refId;
  if (origin) query.origin = origin;
  if (ownerId) query.ownerId = ownerId;

  /**
   * Pagingation starts here
   */

  //set record limit if available
  limit
    ? (paginateOptions.limit = parseInt(limit, 10))
    : (paginateOptions.limit = 20);

  //set skip to next page if available
  paginateOptions.skip = (page - 1) * limit;

  //set page option if available
  page
    ? (paginateOptions.page = parseInt(page, 10))
    : (paginateOptions.page = 1);

  //set sort if available
  sort
    ? (paginateOptions.sort = { createdAt: sort })
    : (paginateOptions.sort = { createdAt: "asc" });

  if (typeof isFlagged === "string") {
    if (isFlagged === "true") {
      query["flags.0"] = { $exists: true };
    } else if (isFlagged === "false") {
      query["flags.0"] = { $exists: false };
    }
  }

  try {
    //paginate model
    await Comments.paginate(query, paginateOptions)
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
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
          };
        });

        //set page info
        let pageInfo = {
          currentPage: comments.page,
          totalPages: comments.totalPages,
          hasNext: comments.hasNextPage,
          hasPrev: comments.hasPrevPage,
          nextPage: comments.nextPage,
          prevPage: comments.prevPage,
          pageRecordCount: comments.docs.length,
          totalRecord: comments.totalDocs,
        };

        let data = {
          records: allComments,
          pageInfo: pageInfo,
        };
        if (data.pageInfo.currentPage > data.pageInfo.totalPages) {
          return next(
            new CustomError(
              "404",
              "Page limit exceeded, No records found!",
              data.pageInfo
            )
          );
        } else {
          responseHandler(res, 200, data, `Comments Retrieved Successfully`);
        }
      })
      .catch(next);
  } catch (err) {
    return next(new CustomError(401, `Something went wrong ${err}`));
  }
};

module.exports = getAllComments;
