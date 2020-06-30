const Joi = require("@hapi/joi");

/**
 * Schema validation for POST '/comments'
 */
const createCommentSchema = {
  options: {
    allowUnknown: true,
  },

  header: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    refId: Joi.string().min(1),
    body: Joi.string().min(1).required(),
    ownerName: Joi.string().min(1).required(),
    ownerEmail: Joi.string().email().required(),
    origin: Joi.string(),
  }),
};

module.exports = createCommentSchema;
