const getAllCommentsSchema = require("./comments/getAllCommentsSchema");
const createCommentSchema = require("./comments/createCommentSchema");
const getSingleCommentSchema = require("./comments/getSingleCommentSchema");
const updateSingleCommentSchema = require("./comments/updateSingleCommentSchema");
const deleteCommentSchema = require("./comments/deleteCommentSchema");
const getCommentVotesSchema = require("./comments/getCommentVotesSchema");
const updateCommentUpAndDownVoteSchema = require("./comments/updateCommentUpAndDownVoteSchema");
const updateSingleCommentFlagSchema = require("./comments/updateSingleCommentFlagSchema");

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
const getAllPlansSchema = require("./applications/getAllPlansSchema");
const getSingleApplicationLogSchema = require("./applications/getSingleApplicationLogSchema");

const createSingleAdminSchema = require("./admins/createSingleAdminSchema");
const deleteSingleAdminSchema = require("./admins/deleteSingleAdminSchema");
const getAllAdminsSchema = require("./admins/getAllAdminsSchema");
const getSingleAdminSchema = require("./admins/getSingleAdminSchema");
const updateSingleAdminSchema = require("./admins/updateSingleAdminSchema");
const changeAdminPasswordSchema = require("./admins/changeAdminPasswordSchema");
const adminDeleteCommentSchema = require("./admins/adminDeleteCommentSchema");

const msAdmins = require("./msadmins");

const subscribeSingleApplicationSchema = require("./subscriptions/subscribeSingleApplication");
const getSingleAppSubscriptionSchema = require("./subscriptions/getSingleAppSubscriptionSchema");

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
  updateSingleCommentFlagSchema,

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
  getAllPlansSchema,
  getSingleApplicationLogSchema,

  // Admins Endpoints validation schemas
  changeAdminPasswordSchema,
  createSingleAdminSchema,
  deleteSingleAdminSchema,
  getAllAdminsSchema,
  getSingleAdminSchema,
  updateSingleAdminSchema,
  adminDeleteCommentSchema,

  // MsAdmins Endpoints validation schemas
  msAdmins,

  //application subscriptions endpoints validation schemas
  subscribeSingleApplicationSchema,
  getSingleAppSubscriptionSchema,
};
