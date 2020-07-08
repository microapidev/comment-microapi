const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for PATCH '/comments/{commentId}/replies/{replyId}'
 */

const updateReplyFlagSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object().keys({
    commentId: Joi.custom(mongoIdSchema, "Mongo ObjectID").required(),
    replyId: Joi.custom(mongoIdSchema, "Mongo ObjectID").required(),
  }),

  body: Joi.object().keys({
    ownerId: Joi.string().required(),
  }),
};

module.exports = updateReplyFlagSchema;
