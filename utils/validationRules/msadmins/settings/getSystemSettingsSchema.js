const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/msadmins/settings'
 */
const getSystemSettingsSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
};

module.exports = getSystemSettingsSchema;
