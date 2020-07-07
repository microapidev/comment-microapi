const Applications = require("../models/applications");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");

/**
 * @author Ibu Eric
 *
 * Creates an application.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

//update an applications details/properties
const updateAppController = async (req, res, next) => {
  const { name } = req.body;
  const { applicationId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      next(new CustomError(422, "invalid ID"));
      return;
    }
    const newAppDetails = await Applications.findById({ _id: applicationId });
    if (!newAppDetails) next(new CustomError(404, "Application Id not found"));
    newAppDetails.name = name;
    newAppDetails.save();
    const data = { newAppDetails };
    const message = "Application details updated!";
    return responseHandler(res, 200, data, message);
  } catch (e) {
    return next(new CustomError(401, `Something went wrong ${e}`));
  }
};

module.exports = updateAppController;
