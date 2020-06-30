const Joi = require("@hapi/joi");

/**
 * Schema validation for PATCH '/comments/{commentId}'
 */
const updateCommentSchema = {
  options: {
    allowUnknown: true,
  },

  header: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    content: Joi.string().min(1),
    ownerId: Joi.string().required(),
  }),
};

module.exports = updateCommentSchema;
