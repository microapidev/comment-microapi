const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/comments/{commentId}'
 */
const getSingleCommentSchema = {
  options: {
    allowUnknown: true,
  },

  header: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    commentId: Joi.string().required(),
  }),
};

module.exports = getSingleCommentSchema;
