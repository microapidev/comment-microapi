const Joi = require("@hapi/joi");
/**
 * Schema getReplyVotesSchema - GET /comments/{commentId}/replies/{replyId}/votes:
 */

const getReplyVotesSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
  params: Joi.object().keys({
    commentId: Joi.string().length(24).require(),
    replyId: Joi.string().length(24).required(),
  }),
  query: Joi.object().keys({
    voteType: Joi.string(),
  }),
};

module.exports = getReplyVotesSchema;
