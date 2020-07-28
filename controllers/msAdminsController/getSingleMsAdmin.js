const MsAdmin = require("../../models/msadmins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author David Okanlawon
 *
 * Gets single microservice system admin account.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getSingleMsAdmin = async (req, res, next) => {
  const { msAdminId } = req.params;

  //get msAdmin account
  try {
    const msAdmin = await MsAdmin.findOneWithDeleted({ _id: msAdminId });
    if (!msAdmin) {
      next(new CustomError(404, "MsAdmin account not found"));
      return;
    }
    const data = {
      fullname: msAdmin.fullname,
      email: msAdmin.email,
      role: msAdmin.role,
      isDisabled: msAdmin.deleted || false,
    };

    return responseHandler(
      res,
      200,
      data,
      "MsAdmin account retrieved successfully"
    );
  } catch (error) {
    next(new CustomError(400, "An error occured retrieving msAdmin account"));
    return;
  }
};

module.exports = getSingleMsAdmin;
