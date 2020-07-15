const mongoose = require("mongoose");
const MsAdmin = require("../../models/msadmins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const {
  hashPassword,
  comparePassword,
} = require("../../utils/auth/passwordUtils");

/**
 * @author David Okanlawon
 *
 * Change microservice admin password
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const changeMsAdminPassword = async (req, res, next) => {
  //get arguments
  const { oldPassword, newPassword } = req.body;
  const { msAdminId } = req.token;

  //check if msAdmin account is valid and exists in organization
  if (!mongoose.Types.ObjectId.isValid(msAdminId)) {
    next(new CustomError(401, "Invalid msAdminId"));
    return;
  }

  const msAdmin = await MsAdmin.findById(msAdminId);
  // if not found return error
  if (!msAdmin) {
    next(new CustomError(401, "Invalid msAdminId"));
    return;
  }

  //if found compare oldpassword
  let passwordMatched;
  try {
    passwordMatched = await comparePassword(oldPassword, msAdmin.password);
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

  //update msAdmin password
  try {
    msAdmin.password = hashedPassword;
    await msAdmin.save();
  } catch (error) {
    next(new CustomError(400, "An error occured updating msAdmin password"));
    return;
  }

  //return new msAdminId
  return responseHandler(res, 200, {}, "MsAdmin password updated successfully");
};

module.exports = changeMsAdminPassword;
