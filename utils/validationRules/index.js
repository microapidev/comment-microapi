const getAllCommentsSchema = require("./comments/getAllCommentsSchema");
const createCommentSchema = require("./comments/createCommentSchema");
const getSingleCommentSchema = require("./comments/getSingleCommentSchema");
const updateCommentSchema = require("./comments/updateCommentSchema");
const deleteCommentSchema = require("./comments/deleteCommentSchema");
const getCommentVotesSchema = require("./comments/getCommentVotesSchema");

/**
 * Object containing schema validations for the endpoints.
 */
module.exports = {
  getAllCommentsSchema,
  createCommentSchema,
  getSingleCommentSchema,
  updateCommentSchema,
  deleteCommentSchema,
  getCommentVotesSchema,
};
