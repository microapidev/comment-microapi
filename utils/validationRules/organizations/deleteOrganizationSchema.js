const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for POST '/organizations/token'
 */
const deleteOrganizationSchema = {
  params: Joi.object().keys({
    organizationId: Joi.custom(mongoIdSchema, "ObjectID").required(),
  }),
};

module.exports = deleteOrganizationSchema;
