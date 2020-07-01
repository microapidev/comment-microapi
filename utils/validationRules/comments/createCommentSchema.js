const Joi = require("@hapi/joi");

/**
 * Schema validation for POST '/comments'
 */
const createCommentSchema = {
  options: {
    allowUnknown: true,
  },

  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    refId: Joi.string(),
    ownerId: Joi.string().required(),
    applicationId: Joi.string().required(),
    content: Joi.string().required(),
    origin: Joi.string(),
  }),
};

module.exports = createCommentSchema;
