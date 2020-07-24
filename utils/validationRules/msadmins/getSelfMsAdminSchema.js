const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/msadmins'
 */
const getSelfMsAdminSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
};

module.exports = getSelfMsAdminSchema;
