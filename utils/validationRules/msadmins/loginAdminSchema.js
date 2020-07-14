const Joi = require("@hapi/joi");

/**
 * Schema validation for POST '/organizations/token'
 */
const loginAdminSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
};

module.exports = loginAdminSchema;
