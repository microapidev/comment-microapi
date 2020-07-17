const Joi = require("@hapi/joi");

/**
 * Schema validation organization process by msadmin'
 */
const organizationsSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    organizationId: Joi.string().required(),
  }),
};
module.exports = organizationsSchema;
