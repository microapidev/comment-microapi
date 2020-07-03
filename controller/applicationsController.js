const Admin = require("../models/admins");
const Organization = require("../models/organizations");
const Application = require("../models/applications");
const { getAppToken } = require("../utils/auth/tokenGenerator");
const { ObjectId } = require("mongoose").Types;

const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");

const createApplication = async (req, res, next) => {
  try {
    //validation should be done via middleware
    //ownerId in body also needs to be validated

    const { name, organizationId, createdBy } = req.body;

    if (!ObjectId.isValid(organizationId) || !ObjectId.isValid(createdBy)) {
      next(new CustomError(404, "invalid ID"));
      return;
    }

    if (!name || !organizationId || !createdBy) {
      next(new CustomError(422, `Enter the required fields`));
      return;
    }

    const admin = await Admin.findById(createdBy);
    const organisation = await Organization.findById(organizationId);
    if (!admin) {
      next(new CustomError(404, "invalid Admin ID"));
      return;
    }
    if (!organisation) {
      next(new CustomError(404, "invalid Organization ID"));
      return;
    }

    const newApplication = new Application({
      name,
      organizationId,
      createdBy,
    });

    const savedApplication = await newApplication.save();
    const applicationToken = await getAppToken(savedApplication._id, createdBy);
    const data = {
      applicationId: savedApplication._id,
      applicationToken: applicationToken,
    };

    responseHandler(res, 201, data, "Application Created successfully");
    return;
  } catch (error) {
    next(
      new CustomError(
        500,
        "Something went wrong, please try again later",
        error
      )
    );
    return;
  }
};

module.exports = {
  createApplication,
};
