const mongoose = require("mongoose");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const Applications = require("../../models/applications");
const Organizations = require("../../models/organizations");
const Admin = require("../../models/admins");
const { getAppToken } = require("../../utils/auth/tokenGenerator");

/**
 * @author Ekeyekwu Oscar
 *
 * Creates an application.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const createSingleApplication = async (req, res, next) => {
  try {
    const { organizationId, adminId } = req.token;
    const { name } = req.body;
z
    //validate organization
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return next(new CustomError(400, "Invalid OrganizationID"));
    }

    const organization = await Organizations.find({ _id: organizationId });
    if (!organization) {
      return next(new CustomError(400, "Organization Not Found"));
    }

    //validate admin
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return next(new CustomError(400, "Invalid AdminID"));
    }

    const admin = await Admin.find({ _id: adminId });
    if (!admin) {
      return next(new CustomError(400, "Admin Not Found"));
    }

    const applicationData = {
      name,
      organizationId,
      createdBy: adminId,
    };

    //create application
    let application;
    try {
      application = new Applications(applicationData);

      await application.save();
    } catch (error) {
      const errorType =
        error.code === 11000
          ? `: Application with name: ${application.name} already exists`
          : "";

      next(
        new CustomError(
          400,
          `An error occured creating application. Error: ${errorType}`
        )
      );
      return;
    }

    //generate token for application
    try {
      const appToken = await getAppToken(application._id, adminId);

      //return response
      return responseHandler(
        res,
        201,
        {
          applicationId: application._id,
          applicationToken: appToken,
        },
        "Application created successfully"
      );
    } catch (error) {
      //delete newly created application
      await application.deleteOne();
      next(new CustomError(400, "An error occured generating token"));
      return;
    }
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong, Try again later", err)
    );
  }
};

module.exports = createSingleApplication;
