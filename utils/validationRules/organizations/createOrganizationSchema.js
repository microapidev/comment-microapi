const Joi = require("@hapi/joi");

/**
 * Schema validation for POST '/organizations'
 */
const createOrganizationSchema = {
  body: Joi.object().keys({
    organizationName: Joi.string().required().min(6),
    organizationEmail: Joi.string().email().required(),
    secret: Joi.string().required().min(6),
    adminName: Joi.string().required().min(6),
    adminEmail: Joi.string().required().email(),
    adminPassword: Joi.string().required().min(6),
  }),
};

module.exports = createOrganizationSchema;
