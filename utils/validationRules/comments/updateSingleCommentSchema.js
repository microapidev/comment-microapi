const Joi = require("@hapi/joi");

/**
 * Schema validation for PATCH '/comments/{commentId}'
 */
const updateSingleCommentSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    commentId: Joi.string().required(),
  }),

  body: Joi.object().keys({
    content: Joi.string().min(1).required(),
    ownerId: Joi.string().required(),
  }),
};

module.exports = updateSingleCommentSchema;
