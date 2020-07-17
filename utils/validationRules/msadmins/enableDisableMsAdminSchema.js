const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for PATCH '/msadmins/:msAdminId'
 */
const enableDisableMsAdminSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object().keys({
    msAdminId: Joi.custom(mongoIdSchema, "mongo ObjectId").required(),
  }),
};

module.exports = enableDisableMsAdminSchema;
