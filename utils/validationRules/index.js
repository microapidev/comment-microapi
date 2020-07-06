const getAllCommentsSchema = require("./comments/getAllCommentsSchema");
const createCommentSchema = require("./comments/createCommentSchema");
const getSingleCommentSchema = require("./comments/getSingleCommentSchema");
const updateCommentSchema = require("./comments/updateCommentSchema");
const deleteCommentSchema = require("./comments/deleteCommentSchema");
const getCommentVotesSchema = require("./comments/getCommentVotesSchema");
const updateCommentUpAndDownVoteSchema = require("./comments/updateCommentUpAndDownVoteSchema");

const getAllRepliesSchema = require("./dummyReplies/getAllRepliesSchema");
const createReplySchema = require("./dummyReplies/createReplySchema");
const getSingleReplySchema = require("./dummyReplies/getSingleReplySchema");
const updateReplySchema = require("./dummyReplies/updateReplySchema");
const deleteReplySchema = require("./dummyReplies/deleteReplySchema");
const getReplyVotesSchema = require("./dummyReplies/getReplyVotesSchema");
const updateReplyUpAndDownVoteSchema = require("./dummyReplies/updateReplyUpAndDownVoteSchema");
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
