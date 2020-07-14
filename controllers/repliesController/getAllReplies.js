const { ObjectId } = require('mongoose').Types;

// Models
const Comments = require('../../models/comments');
const Replies = require('../../models/replies');

// Utilities
const CustomError = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');

/**
 * @author
 *
 * Gets all replies.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getAllReplies = async (req, res, next) => {
  const { commentId } = req.params;
  const { isFlagged, ownerId, limit, page, sort } = req.query;
  const { applicationId } = req.token;

  if (!ObjectId.isValid(commentId)) {
    return next(new CustomError(400, 'Invalid comment Id '));
  }
  try {
    //check if such comment exists
    const comment = await Comments.findOne({ _id: commentId, applicationId });
    // If the comment does not exist,send an error msg
    if (!comment) {
      return next(new CustomError(404, ' Comment not found '));
    }

    // Create query for replies.
    let query = {};
    // Create paginiation options
    let paginateOptions = {};

    query.commentId = commentId;
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
      : (paginateOptions.sort = { createdAt: 'asc' });

    //flag check
    if (typeof isFlagged === 'string') {
      if (isFlagged === 'true') {
        query['flags.0'] = { $exists: true };
      } else if (isFlagged === 'false') {
        query['flags.0'] = { $exists: false };
      }
    }

    const replies = await Replies.paginate(query, paginateOptions);

    const allReplies = replies.docs.map((reply) => {
      return {
        replyId: reply._id,
        commentId: reply.commentId,
        ownerId: reply.ownerId,
        content: reply.content,
        numOfVotes: reply.upVotes.length + reply.downVotes.length,
        numOfUpVotes: reply.upVotes.length,
        numOfDownVotes: reply.downVotes.length,
        numOfFlags: reply.flags.length,
        createdAt: reply.createdAt.toString(),
        updatedAt: reply.updatedAt.toString(),
      };
    });

    //set page info
    let pageInfo = {
      currentPage: replies.page,
      totalPages: replies.totalPages,
      hasNext: replies.hasNextPage,
      hasPrev: replies.hasPrevPage,
      nextPage: replies.nextPage,
      prevPage: replies.prevPage,
      pageRecordCount: replies.docs.length,
      totalRecord: replies.totalDocs,
    };

    //set response message
    let message = ' Replies found. ';
    if (!allReplies.length) {
      message = ' No replies found. ';
    }
    //set data properties
    let data = {
      records: allReplies,
      pageInfo: pageInfo,
    };
    if (data.pageInfo.currentPage > data.pageInfo.totalPages) {
      return next(
        new CustomError(
          '404',
          'Page limit exceeded, No records found!',
          data.pageInfo
        )
      );
    } else {
      responseHandler(res, 200, data, message);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = getAllReplies;
