const getAllCommentsSchema = require("./comments/getAllCommentsSchema");
const createCommentSchema = require("./comments/createCommentSchema");
const getSingleCommentSchema = require("./comments/getSingleCommentSchema");
const updateSingleCommentSchema = require("./comments/updateSingleCommentSchema");
const deleteCommentSchema = require("./comments/deleteCommentSchema");
const getCommentVotesSchema = require("./comments/getCommentVotesSchema");
const updateCommentUpAndDownVoteSchema = require("./comments/updateCommentUpAndDownVoteSchema");

const getAllRepliesSchema = require("./replies/getAllRepliesSchema");
const createReplySchema = require("./replies/createReplySchema");
const getSingleReplySchema = require("./replies/getSingleReplySchema");
const updateReplySchema = require("./replies/updateReplySchema");
const deleteReplySchema = require("./replies/deleteReplySchema");
const getReplyVotesSchema = require("./replies/getReplyVotesSchema");
const updateReplyUpAndDownVoteSchema = require("./replies/updateReplyUpAndDownVoteSchema");
const updateReplyFlagSchema = require("./replies/updateReplyFlagSchema");

const createOrganizationSchema = require("./organizations/createOrganizationSchema");
const getOrganizationTokenSchema = require("./organizations/getOrganizationTokenSchema");

const createApplicationSchema = require("./applications/createApplicationSchema");
const getAllApplicationsSchema = require("./applications/getAllApplicationsSchema");
const getApplicationTokenSchema = require("./applications/getApplicationTokenSchema");
const deleteApplicationSchema = require("./applications/deleteApplicationSchema");
const getSingleApplicationSchema = require("./applications/getSingleApplicationSchema");
const updateApplicationSchema = require("./applications/updateApplicationSchema");

const createSingleAdminSchema = require("./admins/createSingleAdminSchema");
const deleteSingleAdminSchema = require("./admins/deleteSingleAdminSchema");
const getAllAdminsSchema = require("./admins/getAllAdminsSchema");
const getSingleAdminSchema = require("./admins/getSingleAdminSchema");
const updateSingleAdminSchema = require("./admins/updateSingleAdminSchema");
const changeAdminPasswordSchema = require("./admins/changeAdminPasswordSchema");

/**
 * Object containing schema validations for the endpoints.
 */
module.exports = {
  // Comment endpoints validation schemas
  getAllCommentsSchema,
  createCommentSchema,
  getSingleCommentSchema,
  updateSingleCommentSchema,
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
  updateReplyFlagSchema,

  //Organization Endpoints validation schemas
  createOrganizationSchema,
  getOrganizationTokenSchema,

  // Applications Endpoints validation schemas
  createApplicationSchema,
  getAllApplicationsSchema,
  getApplicationTokenSchema,
  deleteApplicationSchema,
  getSingleApplicationSchema,
  updateApplicationSchema,

  // Admins Endpoints validation schemas
  changeAdminPasswordSchema,
  createSingleAdminSchema,
  deleteSingleAdminSchema,
  getAllAdminsSchema,
  getSingleAdminSchema,
  updateSingleAdminSchema,
};
