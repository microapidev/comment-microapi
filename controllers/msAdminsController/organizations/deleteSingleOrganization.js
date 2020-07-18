const mongoose = require("mongoose");
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");
const Organizations = require("../../../models/organizations");
const Admins = require("../../../models/admins");
const Applications = require("../../../models/applications");

const deleteSingleOrganization = async (req, res, next) => {
  const organizationId = req.params.organizationId;
  try {
    const organization = await Organizations.findById(organizationId);
    if (!organization) {
      return next(
        new CustomError(404, "Organization not found or have been removed")
      );
    }
    if (
      !mongoose.Types.ObjectId(organization._id).equals(
        mongoose.Types.ObjectId(organizationId)
      )
    ) {
      return next(
        new CustomError(401, "You're not allowed to perform this operation")
      );
    }
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong,please try again", err.message)
    );
  }

  Organizations.findByIdAndDelete(organizationId)
    .then(async (org) => {
      const data = {
        organizationId: org._id,
        name: org.name,
      };
      responseHandler(
        res,
        200,
        data,
        "Organization deleted successfully. Deleting Admins ..."
      );
      const removedAdmins = await Admins.deleteMany({
        organizationId: data.organizationId,
      });
      if (removedAdmins) {
        responseHandler(
          res,
          200,
          removedAdmins,
          "Admins Deleted Successfully ..."
        );
      }
      const removedApps = await Applications.deleteMany({
        organizationId: organizationId,
      });
      if (removedApps) {
        responseHandler(res, 200, removedApps, "Apps Deleted Successfully ...");
      }
    })
    .catch((err) => {
      return next(
        new CustomError(
          500,
          "Something went wrong, please try again",
          err.message
        )
      );
    });
};
module.exports = deleteSingleOrganization;
