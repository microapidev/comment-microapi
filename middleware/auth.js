const jwtMW = require("express-jwt");
require("dotenv").config();
const CustomError = require("../utils/customError");

const credsRequired = process.env.DISABLE_AUTH.toLowerCase() === "true";

exports.appAuthMW = jwtMW({
  secret: Buffer.from(process.env.APP_SECRET, "base64"),
  requestProperty: "token",
  algorithms: ["HS256"],
  credentialsRequired: credsRequired,
});

exports.orgAuthMW = jwtMW({
  secret: Buffer.from(process.env.ORG_SECRET, "base64"),
  requestProperty: "token",
  algorithms: ["HS256"],
  credentialsRequired: credsRequired,
});

exports.sysAuthMW = jwtMW({
  secret: Buffer.from(process.env.SYSTEM_SECRET, "base64"),
  requestProperty: "token",
  algorithms: ["HS256"],
  credentialsRequired: credsRequired,
});

//middleware to prevent non-superadmins to the routes below
exports.superAdminMW = (req, res, next) => {
  if (req.token.role !== "superadmin") {
    return next(new CustomError(401, "Unauthorized access. Access denied!"));
  }

  next();
};
