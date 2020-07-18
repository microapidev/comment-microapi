const ApplicationModel = require("../../../models/applications");
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");
const softDelete = require("../../../utils/softDelete");

/**
 * @author Ekeyekwu Oscar
 *
 * Block Application from using service
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const blockSingleApplication = async (req, res, next) => {
  const { applicationId } = req.params;
  const { msAdminId } = req.token;

  try {
    //check if Application exists
    const application = await ApplicationModel.findById(applicationId);
    if (!application) {
      next(new CustomError(404, "Application not found or deleted"));
      return;
    }

    //block Application using softDelete
    const blockedApp = await softDelete.deleteById(
      ApplicationModel,
      applicationId,
      msAdminId
    );
    const data = {
      applicationId: blockedApp._id,
      applicationName: blockedApp.name,
      applicationEmail: blockedApp.email,
      blocked: blockedApp.deleted,
      blockedAt: blockedApp.deletedAt,
      blockedBy: blockedApp.deletedBy,
    };
    responseHandler(res, 200, data, "Application Blocked Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = blockSingleApplication;
