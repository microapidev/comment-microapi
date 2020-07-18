const OrganizationModel = require("../../../models/organizations");
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");
const softDelete = require("../../../utils/softDelete");

/**
 * @author Ekeyekwu Oscar
 *
 * unblock organization from using service
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const unblockSingleOrganization = async (req, res, next) => {
  const { organizationId } = req.params;

  try {
    //check if organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      next(new CustomError(404, "Organization not found or deleted"));
      return;
    }

    //unblock organization using softDelete
    const unblockedOrg = await softDelete.restoreById(
      OrganizationModel,
      organization._id
    );
    // const data = {
    //   organizationId: unblockedOrg._id,
    //   organizationName: unblockedOrg.name,
    //   organizationEmail: unblockedOrg.email,
    //   unblocked: unblockedOrg.deleted,
    //   unblockedAt: unblockedOrg.deletedAt,
    //   unblockedBy: unblockedOrg.deletedBy,
    // };
    responseHandler(
      res,
      200,
      unblockedOrg,
      "Organization unblocked Successfully"
    );
  } catch (error) {
    next(
      new CustomError(400, "An error occured unblocking this Organization!")
    );
  }
};

module.exports = unblockSingleOrganization;
