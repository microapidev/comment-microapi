import CustomError from "../utils/customError";

const validationMiddleware = (requestSchema) => {
  return (req, res, next) => {
    const validations = ["headers", "params", "query", "body"].map((key) => {
      const schema = requestSchema[key];
      const value = req[key];
      const validate = () =>
        schema ? schema.validate(value) : Promise.resolve({});
      return validate().then((result) => ({ [key]: result }));
    });
    return Promise.all(validations)
      .then(() => {
        next();
      })
      .catch((validationError) => {
        const message = validationError.details.map((d) => d.message).join("");
        const err = new CustomError(422, message);
        next(err);
      });
  };
};

export default validationMiddleware;
