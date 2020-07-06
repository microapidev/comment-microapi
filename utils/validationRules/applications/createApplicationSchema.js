const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for POST '/applications'
 */
const createApplicationSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    organizationId: Joi.custom(mongoIdSchema, "mongo ObjectID").required(),
    name: Joi.string().required(),
    createdBy: Joi.custom(mongoIdSchema, "mongo ObjectID").required(),
  }),
};

module.exports = createApplicationSchema;
