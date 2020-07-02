const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/comments/:commentId/replies'
 */
const getAllRepliesSchema = {
  options: {
    allowUnknown: true,
  },

  header: Joi.object({
    authorization: Joi.string().required(),
  }),

  query: Joi.object({
    isFlagged: Joi.boolean(),
    ownerId: Joi.string(),
  }),
};

module.exports = getAllRepliesSchema;
