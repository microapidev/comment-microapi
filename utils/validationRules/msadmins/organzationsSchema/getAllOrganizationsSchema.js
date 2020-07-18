const Joi = require("@hapi/joi");

/**
 * Schema validation organization process by msadmin'
 */
const getAllOrganizationsSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
};
module.exports = getAllOrganizationsSchema;
