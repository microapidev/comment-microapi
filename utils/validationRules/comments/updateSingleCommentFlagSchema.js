const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for PATCH '/comments/{commentId}/votes/upvote'
 */
const updateSingleCommentFlagSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    commentId: Joi.custom(mongoIdSchema, "mongo ObjectId").required(),
  }),

  body: Joi.object().keys({
    ownerId: Joi.string().required(),
  }),
};

module.exports = updateSingleCommentFlagSchema;
