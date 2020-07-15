const MsAdmin = require("../../models/msadmins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author David Okanlawon
 *
 * Gets all microservice admins.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getAllMsAdmins = async (req, res, next) => {
  //get all admins mapping the field names appropriately
  let allMsAdmins;
  try {
    const admins = await MsAdmin.find();
    allMsAdmins = admins.map((admin) => {
      return {
        adminId: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
      };
    });
  } catch (error) {
    next(new CustomError(400, "An error occured retrieving admin accounts"));
    return;
  }

  return responseHandler(
    res,
    200,
    allMsAdmins,
    "MsAdmin accounts retrieved successfully"
  );
};

module.exports = getAllMsAdmins;
