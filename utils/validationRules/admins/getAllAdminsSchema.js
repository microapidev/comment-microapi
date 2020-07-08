const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/admins'
 */
const getAllAdminsSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
};

module.exports = getAllAdminsSchema;
