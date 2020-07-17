const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/applicatoions/{applicationId}'
 */
const getOrganizationsAppsSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    organizationId: Joi.string().required(),
  }),
};
module.exports = getOrganizationsAppsSchema;
