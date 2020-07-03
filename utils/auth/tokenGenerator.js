const jwt = require("jsonwebtoken");
const CustomError = require("../customError");
const mongoose = require("mongoose");
const Application = require("../../models/applications");
const Admin = require("../../models/admins");
const Organization = require("../../models/organizations");
require("dotenv").config();

// token generator
const generateToken = (payload, secret, duration = "30d") => {
  const secretPhrase = Buffer.from(secret, "base64");
  const token = jwt.sign(payload, secretPhrase, {
    expiresIn: duration,
    algorithm: "HS256",
  });

  return token;
};

// appToken generator
const getAppToken = async (applicationId, adminId) => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new CustomError(400, "Invalid application ID");
  }

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new CustomError(400, "Invalid admin ID");
  }

  // confirm application exists
  const application = await Application.findById(applicationId);
  if (!application) {
    throw new CustomError(400, "Invalid application ID");
  }

  // confirm adminId belongs to same organization as application
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new CustomError(400, "Invalid admin ID");
  }

  if (!admin.organizationId.equals(application.organizationId)) {
    throw new CustomError(
      401,
      "You are not authorized to access this resource"
    );
  }

  return generateToken(
    {
      applicationId,
      adminId,
    },
    process.env.APP_SECRET
  );
};

// orgToken generator
const getOrgToken = async (organizationId, adminId) => {
  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    throw new CustomError(400, "Invalid organization ID");
  }

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new CustomError(400, "Invalid admin ID");
  }

  // confirm organization exists
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new CustomError(400, "Invalid organization ID");
  }

  // confirm adminId belongs to organization
  const admin = await Admin.find({
    _id: adminId,
    organizationId: organizationId,
  });
  if (!admin) {
    throw new CustomError(
      401,
      "You are not authorized to access this resource"
    );
  }

  return generateToken(
    {
      organizationId,
      adminId,
    },
    process.env.ORG_SECRET
  );
};

module.exports = {
  generateToken,
  getAppToken,
  getOrgToken,
};
