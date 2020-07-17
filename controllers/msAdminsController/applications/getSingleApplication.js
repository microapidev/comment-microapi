const Applications = require("../../../models/applications");
const MsAdmin = require("../../../models/msadmins");
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");

/**
 * @author Ekeyekwu Oscar
 *
 * Gets all applications using the microservice.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getSingleApplication = async (req, res, next) => {
  //get msAdminId from token
  const { msAdminId } = req.token;

  //get single application, map field names appropriately
  let application;
  try {
    //check if msAdmin exists
    const msAdmin = await MsAdmin.findById(msAdminId);
    if (!msAdmin) {
      next(new CustomError(404, "MsAdmin account not found"));
      return;
    }

    //get all applications
    const applications = await Applications.find().populate("organizationId");
    application = {
        applicationId: applications._id,
        applicationName: applications.name,
        organizationId: applications.organizationId,
        organizationName: applications.organizationId.name,
    }
  } catch (error) {
    next(new CustomError(400, "An error occured retrieving Application"));
    return;
  }

  return responseHandler(
    res,
    200,
    application,
    "Application retrieved successfully"
  );
};

module.exports = getSingleApplication;
