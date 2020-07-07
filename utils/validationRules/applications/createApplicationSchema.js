const Joi = require("@hapi/joi");

/**
 * Schema validation for POST '/applications'
 */
const createApplicationSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

module.exports = createApplicationSchema;
