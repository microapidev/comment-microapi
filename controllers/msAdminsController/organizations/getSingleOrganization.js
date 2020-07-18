const OrganizationsModel = require("../../../models/organizations");
const MsAdmin = require("../../../models/msadmins");
// const CommentModel = require("../../../models/comments");
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");

/**
 * @author Ekeyekwu Oscar
 *
 * Gets all organizations using the microservice.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getSingleOrganization = async (req, res, next) => {
  //get msAdminId from token
  const { msAdminId } = req.token;
  const { organizationId } = req.params;

  //get single organization, map field names appropriately
  let organization;
  try {
    //check if msAdmin exists
    const msAdmin = await MsAdmin.findById(msAdminId);
    if (!msAdmin) {
      next(new CustomError(404, "MsAdmin account not found"));
      return;
    }

    //get  organizations
    const singleOrganization = await OrganizationsModel.findById(
      organizationId
    );

    if (!singleOrganization) {
      next(new CustomError(404, "Organization not Found"));
      return;
    }

    organization = {
      organizationId: singleOrganization._id,
      organizationName: singleOrganization.name,
    };
  } catch (error) {
    next(new CustomError(400, "An error occured retrieving organization"));
    return;
  }
  return responseHandler(
    res,
    200,
    organization,
    "organization retrieved successfully"
  );
};

module.exports = getSingleOrganization;
