const getAllCommentsSchema = require("./comments/getAllCommentsSchema");
const createCommentSchema = require("./comments/createCommentSchema");
const getSingleCommentSchema = require("./comments/getSingleCommentSchema");
const updateCommentSchema = require("./comments/updateCommentSchema");
const deleteCommentSchema = require("./comments/deleteCommentSchema");
const getCommentVotesSchema = require("./comments/getCommentVotesSchema");
const updateCommentUpAndDownVoteSchema = require("./comments/updateCommentUpAndDownVoteSchema");

const getAllRepliesSchema = require("./replies/getAllRepliesSchema");
const createReplySchema = require("./replies/createReplySchema");
const getSinlgeReplySchema = require("./replies/getSinlgeReplySchema");
const updateReplySchema = require("./replies/updateReplySchema");
const deleteReplySchema = require("./replies/deleteReplySchema");
const getReplyVotesSchema = require("./replies/getReplyVotesSchema");
const updateReplyUpAndDownVoteSchema = require("./replies/updateReplyUpAndDownVoteSchema");

/**
 * Object containing schema validations for the endpoints.
 */
module.exports = {
  // Comment endpoints validation schemas
  getAllCommentsSchema,
  createCommentSchema,
  getSingleCommentSchema,
  updateCommentSchema,
  deleteCommentSchema,
  getCommentVotesSchema,
  updateCommentUpAndDownVoteSchema,

  // Reply Endpoints validation schemas
  getAllRepliesSchema,
  createReplySchema,
  getSinlgeReplySchema,
  updateReplySchema,
  deleteReplySchema,
  getReplyVotesSchema,
  updateReplyUpAndDownVoteSchema,
};
