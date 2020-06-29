const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/comments'
 */
const getAllCommentsSchema = {
  options: {
    allowUnknown: true,
  },

  header: Joi.object({
    authorization: Joi.string().required(),
  }),

  query: Joi.object({
    isFlagged: Joi.boolean(),
    refId: Joi.string(),
    ownerName: Joi.string(),
    origin: Joi.string(),
    totalVotes: Joi.number(),
  }),
};

module.exports = getAllCommentsSchema;
