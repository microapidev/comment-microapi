const jwtMW = require("express-jwt");
require("dotenv").config();

const credsRequired = process.env.DISABLE_AUTH === "false";

exports.appAuthMW = jwtMW({
  secret: Buffer.from("app_secret", "base64"),
  requestProperty: "token",
  algorithms: ["HS256"],
  credentialsRequired: credsRequired,
});

exports.orgAuthMW = jwtMW({
  secret: process.env.ORG_SECRET,
  requestProperty: "token",
  algorithms: ["HS256"],
  credentialsRequired: credsRequired,
});
