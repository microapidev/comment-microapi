const getAllCommentsSchema = require("./comments/getAllCommentsSchema");
const createCommentSchema = require("./comments/createCommentSchema");
const getCommentSchema = require("./comments/getCommentSchema");

/**
 * Object containing schema validations for the endpoints.
 */
module.exports = {
  getAllCommentsSchema,
  createCommentSchema,
  getCommentSchema,
};
