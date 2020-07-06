const Joi = require("./node_modules/@hapi/joi");

/**
 * Schema validation for GET '/comments/{commentId}/replies/{replyId}'
 */

const getSingleReplySchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object().keys({
    commentId: Joi.string().required(),
    replyId: Joi.string().required(),
  }),
};

module.exports = getSingleReplySchema;
