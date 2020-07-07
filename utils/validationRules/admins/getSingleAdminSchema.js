const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for GET '/admins/:adminId'
 */
const getSingleAdminSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  params: Joi.object().keys({
    adminId: Joi.custom(mongoIdSchema, "mongo ObjectId").required(),
  }),
};

module.exports = getSingleAdminSchema;
