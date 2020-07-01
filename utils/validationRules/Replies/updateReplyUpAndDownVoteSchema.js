const Joi = require("@hapi/joi");

/**
 * Schema validation for PATCH '/comments/{commentId}/replies/{replyId}/votes/upvote'
 */
const updateReplyUpAndDownVoteSchema = {
  options: {
    allowUnknown: true,
  },

  header: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    commentId: Joi.string().required(),
    replyId: Joi.string().required(),
  }),

  body: Joi.object().keys({
    ownerId: Joi.string().required(),
  }),
};

module.exports = updateReplyUpAndDownVoteSchema;
