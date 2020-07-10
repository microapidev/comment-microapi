const mongoose = require("mongoose");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const Applications = require("../../models/applications");
const Organizations = require("../../models/organizations");

/**
 * @author David Okanlawon
 *
 * Gets all applications.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getAllApplications = async (req, res, next) => {
  try {
    const { organizationId } = req.token;
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return next(new CustomError(422, "Invalid OrganizationID"));
    }

    const applications = await Applications.find({ organizationId });
    const allApplication = applications.map((app) => {
      return {
        applicationId: app._id,
        name: app.name,
      };
    });

    const data = allApplication;
    return responseHandler(
      res,
      200,
      data,
      "Organization applications retrieved successfully"
    );
  } catch (err) {
    return next(new CustomError(500, "Something went wrong, Try again later"));
  }
};

module.exports = getAllApplications;
