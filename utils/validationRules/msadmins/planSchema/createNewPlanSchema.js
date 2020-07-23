const Joi = require("@hapi/joi");

/**
 * Schema validation for POST '/admins'
 */
const createNewPlanSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    name: Joi.string().required(),
    loggingEnabled: Joi.boolean().required(),
    maxLogRetentionPeriod: Joi.number().required(),
    requestPerMin: Joi.number().required(),
    maxRequestPerDay: Joi.number().required(),
  }),
};

module.exports = createNewPlanSchema;
