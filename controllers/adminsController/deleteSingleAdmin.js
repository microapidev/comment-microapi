const Admin = require("../../models/admins");
const Organization = require("../../models/organizations");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const mongoose = require("mongoose");
const { comparePassword } = require("../../utils/auth/passwordUtils");

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
  const { adminId: targetAdminId } = req.params;

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

  //validate adminId
  if (!mongoose.Types.ObjectId.isValid(targetAdminId)) {
    next(new CustomError(400, "Invalid target adminId"));
    return;
  }

  //can't delete your own account
  if (targetAdminId === adminId) {
    next(new CustomError(400, "You can't delete you own account!"));
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

    //if found compare password
    let passwordMatched;
    try {
      passwordMatched = await comparePassword(secret, organization.secret);
    } catch (error) {
      next(new CustomError("Secret processing error"));
      return;
    }

    //if not password matched return error
    if (!passwordMatched) {
      next(new CustomError(403, "Invalid secret provided"));
      return;
    }

    //delete account
    await admin.deleteOne();

    return responseHandler(res, 200, "Admin account deleted successfully");
  } catch (error) {
    next(new CustomError(400, "An error occured deleting admin account"));
    return;
  }
};

module.exports = deleteAdmin;
