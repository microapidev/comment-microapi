const ApplicationModel = require("../../../models/applications");
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");
const softDelete = require("../../../utils/softDelete");

/**
 * @author Ekeyekwu Oscar
 *
 * unblock Application from using service
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const unblockSingleApplication = async (req, res, next) => {
  const { applicationId } = req.params;
  try {
    //check if Application exists
    const application = await ApplicationModel.findOneDeleted({
      _id: applicationId,
    });
    if (!application) {
      next(new CustomError(404, "Application not found or deleted"));
      return;
    }

    //unblock Application using softDelete
    const unblockedApp = await softDelete.restoreById(
      ApplicationModel,
      application._id
    );
    const data = {
      applicationId: unblockedApp._id,
      applicationName: unblockedApp.name,
      unblocked: !unblockedApp.deleted ? true : false,
      unblockedAt: unblockedApp.deletedAt,
    };
    responseHandler(res, 200, data, "Application unblocked Successfully");
  } catch (error) {
    next(new CustomError(400, "An error occured unblocking this Application!"));
  }
};

module.exports = unblockSingleApplication;
