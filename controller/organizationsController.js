const Organization = require("../models/organizations");
const Admin = require("../models/admins");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");
const { getOrgToken } = require("../utils/auth/tokenGenerator");
const {
  hashPassword,
  comparePassword,
} = require("../utils/auth/passwordUtils");

const orgCtrl = {
  async createOrganization(req, res, next) {
    const {
      organizationName,
      organizationEmail,
      secret,
      adminName,
      adminEmail,
      adminPassword,
    } = req.body;

    //create organization in DB
    let organization;
    try {
      organization = new Organization({
        name: organizationName,
        email: organizationEmail,
        secret: secret,
      });

      await organization.save();
    } catch (error) {
      const errorType =
        error.code === 11000 ? ": organization email already exists" : "";

      next(
        new CustomError(
          400,
          "An error occured creating organization" + errorType
        )
      );
      return;
    }

    //encrypt password
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(adminPassword);
    } catch (error) {
      next(new CustomError(400, "A password processing error occured"));

      //delete newly created org
      await organization.deleteOne();
      return;
    }

    //save admin with orgId
    let admin;
    try {
      admin = new Admin({
        fullname: adminName,
        email: adminEmail,
        password: hashedPassword,
        organizationId: organization._id,
      });

      await admin.save();
    } catch (error) {
      //delete newly created org
      await organization.deleteOne();

      const errorType =
        error.code === 11000 ? ": admin account already exists" : "";

      next(
        new CustomError(
          400,
          "An error occured creating default admin account" + errorType
        )
      );
      return;
    }

    //generate token for admin user
    try {
      const orgToken = await getOrgToken(organization._id, admin._id);

      //return response
      return responseHandler(
        res,
        201,
        {
          organizationId: organization._id,
          adminId: admin._id,
          organizationToken: orgToken,
        },
        "Organization and default admin account created successfully"
      );
    } catch (error) {
      //delete newly created org and admin
      await organization.deleteOne();
      await admin.deleteOne();

      next(new CustomError(400, "An error occured generating token"));
      return;
    }
  },

  async getOrganizationToken(req, res, next) {
    // find admin account in organization
    const { email, password, organizationId } = req.body;

    // find email of admin in organization
    const admin = await Admin.find({ email, organizationId });

    // if not found return error
    if (!admin) {
      next(new CustomError(400, "Invalid email and/or password"));
      return;
    }

    //if found compare password
    const passwordMatched = await comparePassword(password, admin.password);

    //if not password matched return error
    if (!passwordMatched) {
      next(new CustomError(400, "Invalid email and/or password"));
      return;
    }

    //if password matched generateToken
    const organizationToken = await getOrgToken(organizationId, admin._id);

    return responseHandler(
      res,
      200,
      {
        organizationToken,
      },
      "Organization token generated successfully"
    );
  },
};

module.exports = orgCtrl;
