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
    logging: Joi.boolean(),
    maxLogRetentionPeriod: Joi.number(),
    maxRequestPerMin: Joi.number(),
    maxRequestPerDay: Joi.number(),
    periodWeight: Joi.number().required(),
  }),
};

module.exports = createNewPlanSchema;
