const getAllCommentsSchema = require("./comments/getAllCommentsSchema");
const createCommentSchema = require("./comments/createCommentSchema");
const getSingleCommentSchema = require("./comments/getSingleCommentSchema");
const updateCommentSchema = require("./comments/updateCommentSchema");
const deleteCommentSchema = require("./comments/deleteCommentSchema");
const getCommentVotesSchema = require("./comments/getCommentVotesSchema");
const updateCommentUpAndDownVoteSchema = require("./comments/updateCommentUpAndDownVoteSchema");

const getAllRepliesSchema = require("./Replies/getAllRepliesSchema");
const createReplySchema = require("./Replies/createReplySchema");
const getSingleReplySchema = require("./Replies/getSingleReplySchema");
const updateReplySchema = require("./Replies/updateReplySchema");
const deleteReplySchema = require("./Replies/deleteReplySchema");
const getReplyVotesSchema = require("./Replies/getReplyVotesSchema");
const updateReplyUpAndDownVoteSchema = require("./Replies/updateReplyUpAndDownVoteSchema");
const createOrganizationSchema = require("./organizations/createOrganizationSchema");
const getOrganizationTokenSchema = require("./organizations/getOrganizationTokenSchema");

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
  getSingleReplySchema,
  updateReplySchema,
  deleteReplySchema,
  getReplyVotesSchema,
  updateReplyUpAndDownVoteSchema,

  //Organization Endpoints validation schemas
  createOrganizationSchema,
  getOrganizationTokenSchema,
};
