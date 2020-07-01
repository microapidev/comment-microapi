const jwtMW = require("express-jwt");
require("dotenv").config();

exports.appAuthMW = jwtMW({
  secret: process.env.APP_SECRET,
  requestProperty: "token",
  algorithms: ["RS256"],
  credentialsRequired: !process.env.DISABLE_AUTH,
});

exports.orgAuthMW = jwtMW({
  secret: process.env.ORG_SECRET,
  requestProperty: "token",
  algorithms: ["RS256"],
  credentialsRequired: !process.env.DISABLE_AUTH,
});
