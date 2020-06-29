const getAllCommentsSchema = require("./comments/getAllCommentsSchema");
const createCommentSchema = require("./comments/createCommentSchema");

/**
 * Object containing schema validations for the endpoints.
 */
module.exports = {
  getAllCommentsSchema,
  createCommentSchema,
};
