const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/msadmins/settings'
 */
const updateSystemSettingsSchema = {
  allowUnknowns: false,
  body: Joi.object().keys({
    maxRequestsPerMin: Joi.number(),
    defaultItemsPerPage: Joi.number(),
    maxItemsPerPage: Joi.number(),
    defaultMaxRequestsPerDay: Joi.number(),
    disableRequestLimits: Joi.boolean(),
    loggingEnabled: Joi.boolean(),
    logPageSize: Joi.number(),
  }),
};

module.exports = updateSystemSettingsSchema;
