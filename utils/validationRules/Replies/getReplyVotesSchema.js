const Joi = require("@hapi/joi");
/**
 * Schema getReplyVotesSchema - GET /comments/{commentId}/replies/{replyId}/votes:
 */

const getReplyVotesSchema  = {
  options: {
    allowUnknown: true,
  },

  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
  params: Joi.object().keys({
    commentId: Joi.string().length(24).require(),
    replyId: Joi.string().length(24).required(),
  }),
};

module.exports = getReplyVotesSchema ;
