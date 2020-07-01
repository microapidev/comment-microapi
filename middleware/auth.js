const jwtMW = require("express-jwt");
require("dotenv").config();

exports.appAuthMW = jwtMW({
  secret: Buffer.from(process.env.APP_SECRET, "base64"),
  requestProperty: "token",
  algorithms: ["HS256"],
  credentialsRequired: !process.env.DISABLE_AUTH,
});

exports.orgAuthMW = jwtMW({
  secret: process.env.ORG_SECRET,
  requestProperty: "token",
  algorithms: ["HS256"],
  credentialsRequired: !process.env.DISABLE_AUTH,
});
