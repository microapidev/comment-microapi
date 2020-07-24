const MsAdmin = require("../../models/msadmins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author David Okanlawon
 *
 * Gets currently logged in microservice system admin account.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getSelfMsAdmin = async (req, res, next) => {
  const { msAdminId } = req.token;

  //get the msAdmin account
  try {
    const msAdmin = await MsAdmin.findById(msAdminId);
    if (!msAdmin) {
      next(new CustomError(401, "Invalid account"));
      return;
    }
    const data = {
      fullname: msAdmin.fullname,
      email: msAdmin.email,
      role: msAdmin.role,
    };

    return responseHandler(
      res,
      200,
      data,
      "MsAdmin account retrieved successfully"
    );
  } catch (error) {
    next(error);
    return;
  }
};

module.exports = getSelfMsAdmin;
