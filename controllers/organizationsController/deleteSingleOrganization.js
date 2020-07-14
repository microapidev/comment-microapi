const mongoose = require("mongoose");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const Organizations = require("../../models/organizations");
const Admins = require("../../models/admins");

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
      !mongoose.Types.ObjectId(organization.organizationId).equals(
        mongoose.Types.ObjectId(organizationId)
      )
    ) {
      return next(
        new CustomError(401, "You're not allowed to access this resource")
      );
    }
  } catch (err) {
    return next(
      new CustomError(500, "Something went wrong,please try again", err.message)
    );
  }
  try {
    const admins = await Admins.find({ organizationId: organizationId });
    if (!admins) {
      return next(new CustomError(404, "Admin(s) not found"));
    }
    await admins.remove();
  } catch (error) {
    return next(new CustomError(400, "Delete not Successful"));
  }
  Organizations.findByIdAndDelete(organizationId)
    .then((org) => {
      const data = {
        organizationId: org._id,
        name: org.name,
      };
      responseHandler(res, 200, data, "Organization deleted successfully");
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
