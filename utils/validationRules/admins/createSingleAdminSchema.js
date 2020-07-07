const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for POST '/admins'
 */
const createApplicationSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    organizationId: Joi.custom(mongoIdSchema, "mongo ObjectId").required(),
  }),
};

module.exports = createApplicationSchema;
