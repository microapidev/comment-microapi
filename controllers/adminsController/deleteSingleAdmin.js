const Admin = require("../models/admins");
const Organization = require("../models/organizations");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");
const mongoose = require("mongoose");

/**
 * @author David Okanlawon
 *
 * Deletes an admin account
 *
 * @param {*} req - request object
 * @param {*} res - response object
 * @param {*} next - next middleware function
 * @returns
 */
const deleteAdmin = async (req, res, next) => {
  //get organizationId, adminId from token
  const { organizationId, adminId } = req.token;
  const { secret } = req.body;
  const { adminId: targetAdminId } = req.body;

  //validate organizationId
  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    next(new CustomError(400, "Invalid organizationId"));
    return;
  }

  //validate adminId
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    next(new CustomError(400, "Invalid adminId"));
    return;
  }

  //find target adminId
  try {
    const admin = await Admin.findById(targetAdminId);
    if (!admin) {
      next(new CustomError(404, "Admin account not found"));
      return;
    }

    //confirm requesting adminId and target adminId belong to the same organization
    if (!admin.organizationId.equals(organizationId)) {
      next(new CustomError(404, "Admin account not found"));
      return;
    }

    //confirm organization secret
    const organization = await Organization.findById(organizationId);
    if (organization.secret !== secret) {
      next(new CustomError(403, "Delete operation denied"));
      return;
    }

    //delete account
    await admin.deleteOne();
    await admin.save();

    return responseHandler(res, 200, "Admin account deleted successfully");
  } catch (error) {
    next(new CustomError(400, "An error occured deleting admin account"));
    return;
  }
};

module.exports = deleteAdmin;
