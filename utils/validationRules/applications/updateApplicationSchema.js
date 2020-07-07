const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for PATCH '/applications/:applicationId'
 */
const updateApplicationSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
  params: Joi.object().keys({
    applicationId: Joi.custom(mongoIdSchema, "ObjectID").required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

module.exports = updateApplicationSchema;
