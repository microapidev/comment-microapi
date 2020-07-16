const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for GET '/msadmins/:msAdminId'
 */
const getSingleMsAdminSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object().keys({
    msAdminId: Joi.custom(mongoIdSchema, "mongo ObjectId").required(),
  }),
};

module.exports = getSingleMsAdminSchema;
