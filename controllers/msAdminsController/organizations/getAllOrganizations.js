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

  let query = {};

  try {
    //get all organizations
    const organizations = await OrganizationsModel.paginate(
      query,
      req.paginateOptions
    );

    allOrganizations = organizations.docs.map((organization) => {
      return {
        organizationId: organization._id,
        organizationName: organization.name,
      };
    });

    // Set page info.
    let pageInfo = {
      currentPage: organizations.page,
      totalPages: organizations.totalPages,
      hasNext: organizations.hasNextPage,
      hasPrev: organizations.hasPrevPage,
      nextPage: organizations.nextPage,
      prevPage: organizations.prevPage,
      pageRecordCount: organizations.docs.length,
      totalRecord: organizations.totalDocs,
    };

    let data = {
      records: allOrganizations,
      pageInfo: pageInfo,
    };

    if (data.pageInfo.currentPage > data.pageInfo.totalPages) {
      return next(
        new CustomError(
          "404",
          "Page limit exceeded, No records found!",
          data.pageInfo
        )
      );
    } else {
      responseHandler(res, 200, data, `Organizations Retrieved Successfully`);
    }
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
};

module.exports = getAllOrganizations;
