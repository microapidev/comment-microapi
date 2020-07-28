const OrganizationsModel = require("../../../models/organizations");
const MsAdmin = require("../../../models/msadmins");
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");
const {
  getAllRecords,
  getDeletedRecords,
} = require("../../../utils/softDelete");

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

  //get msAdminId from token
  const { msAdminId } = req.token;

  //check if msAdmin exists
  const msAdmin = await MsAdmin.findById(msAdminId);
  if (!msAdmin) {
    next(new CustomError(404, "MsAdmin account not found"));
    return;
  }

  let query = {};

  const { page, limit } = req.paginateOptions;
  const { filter } = req.query;

  try {
    //get all organizations
    let organizations;
    if (filter === "disabled") {
      organizations = await getDeletedRecords(OrganizationsModel, page, limit);
    } else if (filter === "all") {
      organizations = await getAllRecords(OrganizationsModel, page, limit);
    } else {
      organizations = await OrganizationsModel.paginate(query, {
        ...req.paginateOptions,
      });
    }

    allOrganizations = organizations.docs.map((organization) => {
      return {
        organizationId: organization._id,
        organizationName: organization.name,
        isBlocked: organization.deleted || false,
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
