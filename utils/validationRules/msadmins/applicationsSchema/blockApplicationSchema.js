const Joi = require("@hapi/joi");

/**
 * Schema validation for block '/applicatoions/{applicationId}/block'
 */
const blockApplicationSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    applicationId: Joi.string().required(),
  }),
};

module.exports = blockApplicationSchema;
