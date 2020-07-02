const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");
// Application model
const Applications = require("../models/applications");
const Organizations = require("../models/organizations");

exports.getAllApplications = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orgId)) {
      return next(new CustomError(400, "Invalid ID"));
    }

    const organization = await Organizations.find({ _id: orgId });
    if (!organization) {
      return next(new CustomError(400, "organizations not found"));
    }

    const applicationId = await Applications.findById({});
    if (!applicationId) {
      return next(new CustomError(400, "Application ID not found"));
    }

    // check if application id is for the organization.
    if (!organization.applicationId)
      return next(
        new CustomError(
          401,
          "The Application ID is not recommended for this organization"
        )
      );

    const data = {
      applicationId: organization.applicationId,
      applicationName: organization.applicationName,
    };
    responseHandler(
      res,
      200,
      data,
      "Organization appId retrieved successfully"
    );
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong, Try again later", err)
    );
  }
};
