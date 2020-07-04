const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");
// Application model
const Applications = require("../models/applications");
const Organizations = require("../models/organizations");

exports.getAllApplications = async (req, res, next) => {
  try {
    const { orgId } = req.token;
    if (!mongoose.Types.ObjectId.isValid(orgId)) {
      return next(new CustomError(400, "Invalid OrganizationID"));
    }

    const organization = await Organizations.find({ _id: orgId });
    if (!organization) {
      return next(new CustomError(400, "Invalid organization"));
    }

    const applications = await Applications.find({ organization });
    const allApplication = applications.map((app) => {
      return {
        applicationId: app._id,
        name: app.name,
      };
    });

    const data = [allApplication];
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
