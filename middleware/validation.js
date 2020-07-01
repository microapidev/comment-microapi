const CustomError = require("../utils/customError");

const schemaKeys = ["headers", "params", "query", "body"];

const validationMiddleware = (requestSchema) => {
  return (req, res, next) => {
    const validations = schemaKeys.map((key) => {
      const schema = requestSchema[key];
      const value = req[key];

      if (schema) {
        const result = schema.validate(value);
        return Promise.resolve({ [key]: result });
      } else {
        return Promise.resolve();
      }
    });
    return Promise.all(validations)
      .then((validatedSchemas) => {
        const errors = [];

        // Check all validations for any Joi errors.
        validatedSchemas.forEach((validatedSchema) => {
          schemaKeys.forEach((schemaKey) => {
            if (validatedSchema && validatedSchema[schemaKey]?.error) {
              const messages = validatedSchema[schemaKey].error.details.map(
                (detail) => detail.message + ` in ${schemaKey}`
              );

              errors.push(...messages);
            }
          });
        });

        if (errors.length > 0) {
          next(new CustomError(422, "Invalid input supplied", errors));
        } else {
          next();
        }
      })
      .catch((error) => {
        const err = new CustomError(
          500,
          "Something went wrong, please try again later.",
          error
        );
        next(err);
      });
  };
};

export default validationMiddleware;
