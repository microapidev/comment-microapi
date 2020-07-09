const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for DELETE '/admins/:adminId'
 */
const adminDeleteCommentSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    commentId: Joi.custom(mongoIdSchema, "mongo ObjectId").required(),
  }),
};

module.exports = adminDeleteCommentSchema;
