const mongoose = require("mongoose");
const Admin = require("../../models/admins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author David Okanlawon
 *
 * Gets all admins.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getAllAdmins = async (req, res, next) => {
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
};

module.exports = getAllAdmins;
