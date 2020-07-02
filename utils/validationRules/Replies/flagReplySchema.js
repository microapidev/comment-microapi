const Joi = require("@hapi/joi");

/**
 * Schema validation for PATCH '/comments/{commentId}/replies/{replyId}/flag'
 */
const flagReplySchema = {
  options: {
    allowUnknown: true,
  },

  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object().keys({
    commentId: Joi.string().required(),
    replyId: Joi.string().required(),
  }),

  body: Joi.object().keys({
    ownerId: Joi.string().required(),
  }),
};

module.exports = flagReplySchema;
