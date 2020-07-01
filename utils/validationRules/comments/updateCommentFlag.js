const Joi = require("@hapi/joi");

/**
 * Schema validation for PATCH '/comments/{commentId}/flag'
 */
const updateCommentFlagSchema = {
  options: {
    allowUnknown: true,
  },

  header: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    commentId: Joi.string().required(),
  }),

  body: Joi.object().keys({
    ownerId: Joi.string().required(),
  }),
};

module.exports = updateCommentFlagSchema;

