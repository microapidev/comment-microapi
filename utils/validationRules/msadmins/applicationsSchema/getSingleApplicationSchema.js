const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/applicatoions/{applicationId}'
 */
const getSingleApplicationSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    applicationId: Joi.string().required(),
  }),
};

module.exports = getSingleApplicationSchema;
