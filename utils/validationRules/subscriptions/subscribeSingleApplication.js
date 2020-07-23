const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for subscribing application'
 */
const subscribeSingleApplicationSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object().keys({
    applicationId: Joi.custom(mongoIdSchema, "ObjectID").required(),
    planId: Joi.custom(mongoIdSchema, "ObjectID").required(),
  }),
  body: Joi.object().keys({
    period: Joi.string().required(),
    periodCount: Joi.number().required(),
  }),
};

module.exports = subscribeSingleApplicationSchema;
