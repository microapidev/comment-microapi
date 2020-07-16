const Joi = require("@hapi/joi");

/**
 * Schema validation for GET '/msadmins'
 */
const getAllMsAdminsSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),
};

module.exports = getAllMsAdminsSchema;
