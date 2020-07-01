const jwt = require("jsonwebtoken");
const CustomError = require("../customError");
const mongoose = require("mongoose");
const Application = require("../../models/applications");
const Admin = require("../../models/admins");
const Organization = require("../../models/organizations");

// token generator
exports.generateToken = (payload, secret, duration = "30d") => {
  const secretPhrase = Buffer.from(secret, "base64");
  const token = jwt.sign(payload, secretPhrase, {
    expiresIn: duration,
  });

  return token;
};

// appToken generator
exports.getAppToken = (applicationId, adminId) => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new CustomError(400, "Invalid application ID");
  }

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new CustomError(400, "Invalid admin ID");
  }

  // confirm application exists
  const application = Application.findById(applicationId);
  if (!application) {
    throw new CustomError(400, "Invalid application ID");
  }

  // confirm adminId belongs to same organization as application
  const admin = Admin.findById(adminId);
  if (!admin) {
    throw new CustomError(400, "Invalid admin ID");
  }

  if (admin.organizationId !== application.organizationId) {
    throw new CustomError(
      401,
      "You are not authorized to access this resource"
    );
  }

  this.generateToken(
    {
      applicationId,
      adminId,
    },
    process.env.APP_SECRET
  );
};

// orgToken generator
exports.getOrgToken = (organizationId, adminId) => {
  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    throw new CustomError(400, "Invalid organization ID");
  }

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new CustomError(400, "Invalid admin ID");
  }

  // confirm organization exists
  const organization = Organization.findById(organizationId);
  if (!organization) {
    throw new CustomError(400, "Invalid organization ID");
  }

  // confirm adminId belongs to organization
  const admin = Admin.findById(adminId, organizationId);
  if (!admin) {
    throw new CustomError(
      401,
      "You are not authorized to access this resource"
    );
  }

  this.generateToken(
    {
      organizationId,
      adminId,
    },
    process.env.ORG_SECRET
  );
};
