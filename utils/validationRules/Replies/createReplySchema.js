const Joi = require("@hapi/joi");

/**
 * Schema validation for POST '/comments/{commentId}/replies'
 */
const createReplySchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    commentId: Joi.string().length(24).required(),
  }),

  body: Joi.object().keys({
    ownerId: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

module.exports = createReplySchema;
