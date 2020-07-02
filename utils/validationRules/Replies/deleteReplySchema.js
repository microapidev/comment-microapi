const Joi = require("@hapi/joi");

/**
 * Schema validation for Delete '/comments/{commentId}/replies/{replyId}'
 */
const deleteReplySchema = {
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }),

  params: Joi.object().keys({
    commentId: Joi.string().length(24).required(),
    replyId: Joi.string().length(24).required(),
  }),

  body: Joi.object().keys({
    ownerId: Joi.string().required(),
  }),
};

module.exports = deleteReplySchema;
