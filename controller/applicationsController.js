const Applications = require("../models/applications");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");

const appController = {
  //Commented block gets all applications
  /*  getAllApplications: async (req, res, next) => {
    try {
      const allApps = await Applications.find();
      const data = allApps;
      const message = "All applications retrieved successfully";
      return responseHandler(res, 200, data, message);
    } catch (error) {
      return next(new CustomError(401, `Something went wrong ${error}`));
    }
  }, */

  //update an applications details/properties
  updateAppController: async (req, res, next) => {
    const { name } = req.body;
    const { applicationId } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        next(new CustomError(422, "invalid ID"));
        return;
      }
      const newAppDetails = await Applications.findById({ _id: applicationId });
      if (!newAppDetails)
        next(new CustomError(404, "Application Id not found"));
      newAppDetails.name = name;
      newAppDetails.save();
      const data = { newAppDetails };
      const message = "Application details updated!";
      return responseHandler(res, 200, data, message);
    } catch (e) {
      return next(new CustomError(401, `Something went wrong ${e}`));
    }
  },
};

module.exports = appController;
