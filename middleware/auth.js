const mongoose = require("mongoose");

exports.appAuthMW = (req, res, next) => {
  req.token = {
    applicationId: mongoose.Types.ObjectId(),
  };
  next();
};

exports.orgAuthMW = (req, res, next) => {
  req.token = {
    organizationId: mongoose.Types.ObjectId(),
  };
  next();
};
