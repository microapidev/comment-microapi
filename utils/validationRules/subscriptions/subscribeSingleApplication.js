const Joi = require("@hapi/joi");

/**
 * Schema validation for POST '/comments'
 */
const subscribeSingleApplicationSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object().keys({
    applicationId: Joi.string().required(),
    planId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    period: Joi.string().required(),
  }),
};

module.exports = subscribeSingleApplicationSchema;
