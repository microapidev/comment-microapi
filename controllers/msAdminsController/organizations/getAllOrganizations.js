const OrganizationsModel = require("../../../models/organizations");
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");

/**
 * @author Ekeyekwu Oscar
 *
 * Gets all organizations using the microservice.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getAllOrganizations = async (req, res, next) => {
  //get all organizations and map field names appropriately
  let allOrganizations;
  try {
    //get all organizations
    const organizations = await OrganizationsModel.find();
    allOrganizations = organizations.map((organization) => {
      return {
        organizationId: organization._id,
        organizationName: organization.name,
      };
    });
  } catch (error) {
    next(
      new CustomError(
        500,
        "Something went wrong! Please try again",
        error.message
      )
    );
    return;
  }

  return responseHandler(
    res,
    200,
    allOrganizations,
    "All Organizations retrieved successfully"
  );
};

module.exports = getAllOrganizations;
