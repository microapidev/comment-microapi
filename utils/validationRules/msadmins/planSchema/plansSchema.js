const Joi = require("@hapi/joi");

/**
 * Schema validation for POST '/admins'
 */
const createNewPlanSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object({
    planId: Joi.string().required(),
  }),
};

module.exports = createNewPlanSchema;
