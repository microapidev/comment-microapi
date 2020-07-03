const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/comments/{commentId}/replies/{replyId}'
 */

const getSingleReplySchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object().keys({
    commentId: Joi.string().length(24).required(),
    replyId: Joi.string().length(24).required(),
  }),
};

module.exports = getSingleReplySchema;
