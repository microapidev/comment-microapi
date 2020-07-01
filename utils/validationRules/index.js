const getAllCommentsSchema = require("./comments/getAllCommentsSchema");
const createCommentSchema = require("./comments/createCommentSchema");
const getCommentSchema = require("./comments/getCommentSchema");
const updateCommentSchema = require("./comments/updateCommentSchema");
const deleteCommentSchema = require("./comments/deleteCommentSchema");

/**
 * Object containing schema validations for the endpoints.
 */
module.exports = {
  getAllCommentsSchema,
  createCommentSchema,
  getCommentSchema,
  updateCommentSchema,
  deleteCommentSchema,
};
