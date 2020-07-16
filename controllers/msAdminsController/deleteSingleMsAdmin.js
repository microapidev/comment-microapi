const MsAdmin = require("../../models/msadmins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author David Okanlawon
 *
 * Deletes an MsAdmin account
 *
 * @param {*} req - request object
 * @param {*} res - response object
 * @param {*} next - next middleware function
 * @returns
 */
const deleteMsAdmin = async (req, res, next) => {
  const { msAdminId: targetMsAdminId } = req.params;
  const { msAdminId } = req.token;

  //can't delete your own account
  if (targetMsAdminId === msAdminId) {
    next(new CustomError(400, "You can't delete you own account!"));
    return;
  }

  //find target msAdminId
  try {
    const msAdmin = await MsAdmin.findById(targetMsAdminId);
    if (!msAdmin) {
      next(new CustomError(404, "msAdmin account not found"));
      return;
    }

    //delete account
    await msAdmin.deleteOne();

    return responseHandler(
      res,
      200,
      { msAdminId: msAdmin.id },
      "msAdmin account deleted successfully"
    );
  } catch (error) {
    next(new CustomError(400, "An error occured deleting msAdmin account"));
    return;
  }
};

module.exports = deleteMsAdmin;
