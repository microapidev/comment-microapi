const Joi = require("@hapi/joi");

/**
 * Schema validation for POST '/applications'
 */
const getAllApplicationsSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
};

module.exports = getAllApplicationsSchema;
