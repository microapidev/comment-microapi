const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for POST '/applications/:applicationId/token'
 */
const getApplicationTokenSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
  params: Joi.object().keys({
    applicationId: Joi.custom(mongoIdSchema, "ObjectID").required(),
  }),
};

module.exports = getApplicationTokenSchema;
