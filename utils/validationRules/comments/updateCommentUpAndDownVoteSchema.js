const Joi = require("@hapi/joi");

/**
 * Schema validation for PATCH '/comments/{commentId}/votes/upvote'
 */
const updateCommentUpAndDownVoteSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    commentId: Joi.string().required(),
  }),

  body: Joi.object().keys({
    ownerId: Joi.string().required(),
  }),
};

module.exports = updateCommentUpAndDownVoteSchema;
