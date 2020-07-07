const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for POST '/organizations/token'
 */
const getOrganizationTokenSchema = {
  body: Joi.object().keys({
    organizationId: Joi.custom(mongoIdSchema, "ObjectID").required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
};

module.exports = getOrganizationTokenSchema;
