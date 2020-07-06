const mongoose = require("mongoose");
const Admin = require("../../models/admins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author David Okanlawon
 *
 * Updates a single admin.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const updateSingleAdmin = async (req, res, next) => {
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
};

module.exports = updateSingleAdmin;
