const Applications = require("../models/applications");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");

exports.update = async (req, res, next) => {
  const { applicationId } = req.params;
  const { applicationName } = req.body;

  Applications.findById(applicationId)
    .exec()
    .then((app) => {
      if (!app) {
        next(
          new CustomError(
            404,
            `Application with this ${applicationId}  ID is not found`
          )
        );
      } else {
        Applications.updateOne(
          { _id: applicationId },
          { $set: { name: applicationName } }
        )
          .then(() => {
            return (
              responseHandler(res, 200, { name: applicationName }),
              "Update sucessfully"
            );
          })
          .catch((err) => {
            return next(
              new CustomError(400, "Update failed, Please try agin", err)
            );
          });
      }
    })
    .catch((err) => next(new CustomError(500, "Server error", err)));
};
