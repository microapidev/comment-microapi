const Joi = require("@hapi/joi");

/**
 * Schema validation for Delete '/comments/{commentId}/replies/{replyId}'
 */
const deleteReplySchema = {
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }),

  params: Joi.object().keys({
    commentId: Joi.string().required(),
    replyId: Joi.string().required(),
  }),

  body: Joi.object().keys({
    ownerId: Joi.string().required(),
  }),
};

module.exports = deleteReplySchema;
