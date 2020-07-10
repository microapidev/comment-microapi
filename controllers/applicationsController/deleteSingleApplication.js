const mongoose = require("mongoose");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const Applications = require("../../models/applications");

const deleteSingleApplication = async (req, res, next) => {
  const applicationId = req.params.applicationId;
  const organizationId = req.token.organizationId;
  try {
    const application = await Applications.findById(applicationId);
    if (!application) {
      return next(new CustomError(404, "Application not found"));
    }
    if (
      !mongoose.Types.ObjectId(application.organizationId).equals(
        mongoose.Types.ObjectId(organizationId)
      )
    ) {
      return next(
        new CustomError(401, "You're not allowed to access this resource")
      );
    }
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong,please try again", err.message)
    );
  }
  Applications.findByIdAndDelete(applicationId)
    .then((app) => {
      const data = {
        applicationId: app._id,
        name: app.name,
      };
      responseHandler(res, 200, data, "Application deleted successfully");
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
