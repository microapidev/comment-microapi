const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const Applications = require("../../models/applications");

const deleteSingleApplication = async (req, res, next) => {
  const applicationId = req.params.applicationId;
  const organizationId = req.token.organizationId;
  try {
    const application = await Applications.findById(applicationId);
    if (!application) {
      return next(new CustomError(400, "Application not found"));
    }
    if (application.organizationId !== organizationId) {
      return next(
        new CustomError(403, "You're not allowed to access this resource")
      );
    }
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong,please try again", err.message)
    );
  }
  Applications.findByIdAndDelete(applicationId)
    .then((app) => {
      responseHandler(res, 200, app, "Application deleted successfully");
    })
    .catch((err) => {
      return next(
        new CustomError(
          500,
          "Something went wrong, please try again",
          err.message
        )
      );
    });
};
module.exports = deleteSingleApplication;
