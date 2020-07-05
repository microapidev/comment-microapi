const Joi = require("./node_modules/@hapi/joi");

/**
 * Schema validation for POST '/comments/{commentId}/replies'
 */
const createReplySchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    commentId: Joi.string().required(),
  }),

  body: Joi.object().keys({
    ownerId: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

module.exports = createReplySchema;
