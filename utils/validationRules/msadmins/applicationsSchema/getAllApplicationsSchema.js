const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/msadmins'
 */
const getAllApplicationsSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
};

module.exports = getAllApplicationsSchema;
