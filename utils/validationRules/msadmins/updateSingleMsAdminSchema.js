const Joi = require("@hapi/joi");

/**
 * Schema validation for PATCH '/msadmins'
 */
const updateSingleMsAdminSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    fullname: Joi.string().required(),
  }),
};

module.exports = updateSingleMsAdminSchema;
