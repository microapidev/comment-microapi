const Joi = require("@hapi/joi");

/**
 * Schema validation for get all plans
 */
const getAllPlans = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
};

module.exports = getAllPlans;
