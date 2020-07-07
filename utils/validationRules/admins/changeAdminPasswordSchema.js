const Joi = require("@hapi/joi");

/**
 * Schema validation for PATCH '/admins/change-password'
 */
const changeAdminPasswordSchema = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }),

  body: Joi.object().keys({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string()
      .min(8)
      .not(Joi.ref("oldPassword"))
      .messages({
        "any.invalid": "newPassword must be different from oldPassword",
      })
      .required(),
  }),
};

module.exports = changeAdminPasswordSchema;
