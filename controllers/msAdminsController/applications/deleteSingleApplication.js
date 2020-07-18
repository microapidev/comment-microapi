const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");
const ApplicationModel = require("../../../models/applications");

const deleteSingleApplication = async (req, res, next) => {
  const applicationId = req.params.applicationId;
  try {
    const application = await ApplicationModel.findByIdAndDelete(applicationId);
    if (!application) {
      return next(
        new CustomError(404, "Application not found or have been Deleted")
      );
    }
    const data = {
      applicationName: application.name,
    };
    responseHandler(res, 200, data, "Application Deleted Successfully");
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong,please try again", err.message)
    );
  }
};
module.exports = deleteSingleApplication;
