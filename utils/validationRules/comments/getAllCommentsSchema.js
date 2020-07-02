const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/comments'
 */
const getAllCommentsSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  query: Joi.object({
    isFlagged: Joi.boolean(),
    refId: Joi.string(),
    ownerId: Joi.string(),
    origin: Joi.string(),
  }),
};

module.exports = getAllCommentsSchema;
