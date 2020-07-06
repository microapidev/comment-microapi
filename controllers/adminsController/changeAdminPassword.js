const mongoose = require("mongoose");
const Admin = require("../../models/admins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const {
  hashPassword,
  comparePassword,
} = require("../../utils/auth/passwordUtils");

/**
 * @author David Okanlawon
 *
 * Change admin password
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const changeAdminPassword = async (req, res, next) => {
  //get arguments
  const { oldPassword, newPassword } = req.body;
  const { adminId } = req.token;

  //check if admin account is valid and exists in organization
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    next(new CustomError(400, "Invalid adminId"));
    return;
  }

  const admin = await Admin.findById(adminId);
  // if not found return error
  if (!admin) {
    next(new CustomError(400, "Invalid admin account"));
    return;
  }

  //if found compare oldpassword
  let passwordMatched;
  try {
    passwordMatched = await comparePassword(oldPassword, admin.password);
  } catch (error) {
    next(new CustomError("Password check error"));
    return;
  }

  //if not password matched return error
  if (!passwordMatched) {
    next(new CustomError(400, "Incorrect old password provided"));
    return;
  }

  //hash new password
  let hashedPassword;
  try {
    hashedPassword = await hashPassword(newPassword);
  } catch (error) {
    next(new CustomError(400, "A password hashing error occured"));
    return;
  }

  //update admin password
  try {
    admin.password = hashedPassword;
    await admin.save();
  } catch (error) {
    next(new CustomError(400, "An error occured updating admin password"));
    return;
  }

  //return new adminId
  return responseHandler(res, 201, {}, "Admin password updated successfully");
};

module.exports = changeAdminPassword;
