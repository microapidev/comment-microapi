const Applications = require('../../../models/applications');
const Organizations = require('../../../models/organizations');
const MsAdmin = require('../../../models/msadmins');
const CustomError = require('../../../utils/customError');
const responseHandler = require('../../../utils/responseHandler');

/**
 * @author Ekeyekwu Oscar
 *
 * Gets all applications using the microservice.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getOrganizationsApps = async (req, res, next) => {
  //get msAdminId from token
  const { msAdminId } = req.token;
  const { organizationId } = req.params;

  //get all applications and map field names appropriately
  let allOrgApps;
  try {
    //check if msAdmin exists
    const msAdmin = await MsAdmin.findById(msAdminId);
    if (!msAdmin) {
      next(new CustomError(404, 'MsAdmin account not found'));
      return;
    }

    const organization = await Organizations.findById(organizationId);
    if (!organization) {
        next(new CustomError(404, 'Organization not found'));
        return;
      }
    //get all applications
    const applications = await Applications.find({
      organizationId: organizationId,
    }).populate('createdBy');
    allOrgApps = applications.map((application) => {
      return {
        applicationId: application._id,
        applicationName: application.name,
        createdBy: application.createdBy.fullname,
        createdAt: application.createdAt,
      };
    });
  } catch (error) {
    next(new CustomError(400, 'An error occured retrieving Organization Applications'));
    return;
  }

  return responseHandler(
    res,
    200,
    allOrgApps,
    'All Applications retrieved successfully'
  );
};

module.exports = getOrganizationsApps;
