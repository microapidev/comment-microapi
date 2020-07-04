const Admin = require("../models/admins");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");
const mongoose = require("mongoose");
const { hashPassword } = require("../utils/auth/passwordUtils");

const adminCtrl = {
  async createAdmin(req, res, next) {
    //get arguments
    const { fullname, email, password } = req.body;
    const { adminId, organizationId } = req.token;

    //check if admin account is valid and exists in organization
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      next(new CustomError(400, "Invalid adminId"));
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      next(new CustomError(400, "Invalid organizationId"));
      return;
    }

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

    //---- TO-DO password should prolly be system generated for new acccounts -----
    //hash password
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
    } catch (error) {
      next(new CustomError(400, "A password processing error occured"));
    }

    //save new admin in organization
    let newAdmin;
    try {
      newAdmin = new Admin({
        fullname: fullname,
        email: email,
        password: hashedPassword,
        organizationId: organizationId,
      });

      await newAdmin.save();
    } catch (error) {
      console.log(error.message);

      const errorType =
        error.code === 11000 ? ": admin account already exists" : "";

      next(
        new CustomError(
          400,
          "An error occured creating admin account" + errorType
        )
      );
      return;
    }

    //return new adminId
    return responseHandler(
      res,
      201,
      { adminId: newAdmin._id },
      "Admin account created successfully"
    );
  },

  async getAllAdmins(req, res, next) {
    //get organizationId from token
    const { organizationId } = req.token;
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      next(new CustomError(400, "Invalid organizationId"));
      return;
    }

    //get all organizations mapping the field names appropriately
    let allAdmins;
    try {
      const admins = await Admin.find({ organizationId: organizationId });
      allAdmins = admins.map((admin) => {
        return {
          adminId: admin._id,
          fullname: admin.fullname,
          email: admin.email,
        };
      });
    } catch (error) {
      next(new CustomError(400, "An error occured retrieving admin accounts"));
      return;
    }

    //return array
    if (!allAdmins.length) {
      return responseHandler(res, 404, allAdmins, "No admin accounts found");
    }

    return responseHandler(
      res,
      200,
      allAdmins,
      "Admin accounts retrieved successfully"
    );
  },

  async updateAdmin(req, res, next) {
    //get adminId from token
    const { adminId } = req.token;
    const { fullname } = req.body;

    //validate adminId
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      next(new CustomError(400, "Invalid adminId"));
      return;
    }

    //find admin
    try {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        next(new CustomError(404, "Admin account not found"));
        return;
      }

      //update name only
      admin.fullname = fullname;
      await admin.save();

      return responseHandler(res, 200, "Admin account updated successfully");
    } catch (error) {
      next(new CustomError(400, "An error occured updating admin account"));
      return;
    }
  },
};

module.exports = adminCtrl;
