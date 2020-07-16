const Applications = require('../../models/applications');
const MsAdmin = require('../../models/msadmins');
const CustomError = require('../../utils/customError');
const responseHandler = require('../../utils/responseHandler');

/**
 * @author Ekeyekwu Oscar
 *
 * Gets all applications using the microservice.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const msGetAllApplications = async (req, res, next) => {
  //get msAdminId from token
  const { msAdminId } = req.token;

  //get all applications and map field names appropriately
  let allApplications;
  try {
    //check if msAdmin exists
    const msAdmin = await MsAdmin.findById(msAdminId);
    if (!msAdmin) {
      next(new CustomError(404, 'MsAdmin account not found'));
      return;
    }

    //get all applications 
    const applications = await Applications.find().populate("Organizations");
    allApplications = applications.map((application) => {
      return {
        applicationId: application._id,
        applicationName: application.name,
        organizationId: application.organizationId,
        organizationName: applications.Organizations.name
      };
    });
  } catch (error) {
    next(new CustomError(400, 'An error occured retrieving All Applications'));
    return;
  }

  return responseHandler(
    res,
    200,
    allApplications,
    'All Applications retrieved successfully'
  );
};

module.exports = msGetAllApplications;
