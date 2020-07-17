const OrganizationModel = require("../../../models/organizations");
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");
const softDelete = require("../../../utils/softDelete");

/**
 * @author Ekeyekwu Oscar
 *
 * Block organization from using service
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const blockSingleOrganization = async (req, res, next) => {
  const { organizationId } = req.params;
  const { msAdminId } = req.token;

  try {
    console.log(organizationId);
    //check if organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      next(new CustomError(404, "Organization not found or deleted"));
      return;
    }

    //block organization using softDelete
    const blockedOrg = await softDelete.deleteById(
      OrganizationModel,
      organizationId,
      msAdminId
    );
    const data = {
      organizationId: blockedOrg._id,
      organizationName: blockedOrg.name,
      organizationEmail: blockedOrg.email,
      blocked: blockedOrg.deleted,
      blockedAt: blockedOrg.deletedAt,
      blockedBy: blockedOrg.deletedBy,
    };
    responseHandler(res, 200, data, "Organization Blocked Successfully");
  } catch (error) {
    next(new CustomError(400, "An error occured blocking this Organization!"));
  }
};

module.exports = blockSingleOrganization;
