const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/comments/{commentId}/votes'
 */
const getCommentVotesSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    commentId: Joi.string().required(),
  }),

  query: Joi.object({
    voteType: Joi.string().valid("upvote").valid("downvote"),
  }),
};

module.exports = getCommentVotesSchema;
