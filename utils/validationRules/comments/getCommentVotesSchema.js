const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/comments/{commentId}/votes'
 */
const getCommentVotesSchema = {
  options: {
    allowUnknown: true,
  },

  header: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    commentId: Joi.string().required(),
  }),

  query: Joi.object({
    voteType: Joi.string().allow("upvote").allow("downvote"),
  }),
};

module.exports = getCommentVotesSchema;
