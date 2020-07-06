const mongoose = require("mongoose");
const Admin = require("../../models/admins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author David Okanlawon
 *
 * Gets single admin account.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getSingleAdmin = async (req, res, next) => {
  //get organizationId from token
  const { organizationId } = req.token;
  const { adminId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    next(new CustomError(400, "Invalid organizationId"));
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    next(new CustomError(400, "Invalid adminId"));
    return;
  }

  //get admin account
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      next(new CustomError(404, "Admin account not found"));
      return;
    }
    const data = {
      fullname: admin.fullname,
      email: admin.email,
    };

    return responseHandler(
      res,
      200,
      data,
      "Admin account retrieved successfully"
    );
  } catch (error) {
    next(new CustomError(400, "An error occured retrieving admin account"));
    return;
  }
};

module.exports = getSingleAdmin;
