const Joi = require("@hapi/joi");
const mongoIdSchema = require("../mongoIdSchema");

/**
 * Schema validation for DELETE '/admins/:adminId'
 */
const deleteSingleAdminSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    secret: Joi.string().required(),
  }),

  params: Joi.object().keys({
    adminId: Joi.custom(mongoIdSchema, "mongo ObjectId").required(),
  }),
};

module.exports = deleteSingleAdminSchema;
