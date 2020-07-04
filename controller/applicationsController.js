const Applications = require("../models/applications");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");
const Organizations = require("../models/organizations");

exports.getSingleApplication = async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return next(new CustomError(400, "Application's ID not found"));
    }
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return next(new CustomError(400, "Organization's ID not found"));
    }

    const application = await Applications.findById(applicationId);
    if (!application) {
      return next(new CustomError(400, "Application not found"));
    }
    const organization = await Organizations.findById(organizationId);
    if (!organization) {
      return next(new CustomError(400, "Organization not found"));
    }

    // Confirm if the application is for the organization
    if (!organization.applicationId)
      return next(
        new CustomError(
          401,
          "The Application ID is not recommended for this organization"
        )
      );

    const data = {
      organizationId: organizationId,
      applicationId: organization.applicationId,
    };
    responseHandler(
      res,
      200,
      data,
      "Organization's application retrieved successfully"
    );
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong, Try again later", err)
    );
  }
};
