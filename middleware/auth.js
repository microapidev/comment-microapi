const jwtMW = require("express-jwt");

exports.appAuthMW = jwtMW({
  secret: process.env.APP_SECRET,
  requestProperty: "token",
  credentialsRequired: process.env.DISABLE_AUTH,
});

exports.orgAuthMW = jwtMW({
  secret: process.env.ORG_SECRET,
  requestProperty: "token",
  credentialsRequired: process.env.DISABLE_AUTH,
});
