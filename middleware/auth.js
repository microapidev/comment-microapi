const jwtMW = require("express-jwt");

exports.appAuthMW = jwtMW({
  secret: process.env.APP_SECRET,
});

exports.orgAuthMW = jwtMW({
  secret: process.env.ORG_SECRET,
});
