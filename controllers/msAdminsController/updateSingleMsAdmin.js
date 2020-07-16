const mongoose = require("mongoose");
const MsAdmin = require("../../models/msadmins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author David Okanlawon
 *
 * Updates a single MsAdmin.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const updateSingleMsAdmin = async (req, res, next) => {
  //get msAdminId from token
  const { msAdminId } = req.token;
  const { fullname } = req.body;

  //validate msAdminId
  if (!mongoose.Types.ObjectId.isValid(msAdminId)) {
    next(new CustomError(400, "Invalid msAdminId"));
    return;
  }

  //find msAdmin
  try {
    const msAdmin = await MsAdmin.findById(msAdminId);
    if (!msAdmin) {
      next(new CustomError(404, "MsAdmin account not found"));
      return;
    }

    //update name only
    msAdmin.fullname = fullname;
    await msAdmin.save();

    return responseHandler(res, 200, "MsAdmin account updated successfully");
  } catch (error) {
    next(new CustomError(400, "An error occured updating msAdmin account"));
    return;
  }
};

module.exports = updateSingleMsAdmin;
