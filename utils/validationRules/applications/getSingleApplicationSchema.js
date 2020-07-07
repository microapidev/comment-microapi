const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for GET '/applications/:applicationId'
 */
const getSingleApplicationSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
  params: Joi.object().keys({
    applicationId: Joi.custom(mongoIdSchema, "ObjectID").required(),
  }),
};

module.exports = getSingleApplicationSchema;
