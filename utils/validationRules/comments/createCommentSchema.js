const Joi = require("@hapi/joi");

/**
 * Schema validation for POST '/comments'
 */
const createCommentSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    refId: Joi.string(),
    ownerId: Joi.string().required(),
    content: Joi.string().required(),
    origin: Joi.string(),
  }),
};

module.exports = createCommentSchema;
