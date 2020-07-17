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
const getAllApplications = async (req, res, next) => {
  //get msAdminId from token
  const { msAdminId } = req.token;

  //get all applications and map field names appropriately
  let allApplications;
  try {
    //check if msAdmin exists
    const msAdmin = await MsAdmin.findById(msAdminId);
    if (!msAdmin) {
      next(new CustomError(404, "MsAdmin account not found"));
      return;
    }

    //get all applications
    const applications = await Applications.find().populate("organizationId");
    allApplications = applications.map((application) => {
      return {
        applicationId: application._id,
        applicationName: application.name,
        organizationId: application.organizationId,
        organizationName: application.organizationId.name,
      };
    });
  } catch (error) {
    next(error);
    return;
  }

  return responseHandler(
    res,
    200,
    allApplications,
    "All Applications retrieved successfully"
  );
};

module.exports = getAllApplications;
