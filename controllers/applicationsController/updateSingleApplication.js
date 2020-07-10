const mongoose = require("mongoose");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const Applications = require("../../models/applications");
const Organizations = require("../../models/organizations");

/**
 * @author David Okanlawon
 *
 * Updates an application's details.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const updateSingleApplication = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { applicationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return next(new CustomError(400, "Invalid applicationID"));
    }

    const { organizationId } = req.token;
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return next(new CustomError(400, "Invalid OrganizationID"));
    }

    const organization = await Organizations.find({ _id: organizationId });
    if (!organization) {
      return next(new CustomError(400, "Invalid organization"));
    }

    const application = await Applications.findById(applicationId);
    if (!application) {
      return next(new CustomError(404, "Application not found"));
    }

    //update application
    try {
      application.name = name;
      await application.save();
    } catch (error) {
      next(new CustomError(400, "An error occured updating application"));
      return;
    }

    return responseHandler(
      res,
      200,
      { applicationId: application._id, name: application.name },
      "Application updated successfully"
    );
  } catch (err) {
    return next(new CustomError(500, "Something went wrong, Try again later"));
  }
};

module.exports = updateSingleApplication;
