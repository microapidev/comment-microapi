const Organization = require("../models/organizations");
const Admin = require("../models/admins");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");
const { getOrgToken } = require("../utils/auth/tokenGenerator");
const { hashPassword } = require("../utils/auth/passwordUtils");

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
};

module.exports = orgCtrl;
