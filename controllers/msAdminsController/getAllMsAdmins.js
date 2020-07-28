const MsAdmin = require("../../models/msadmins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const { getAllRecords, getDeletedRecords } = require("../../utils/softDelete");

/**
 * @author David Okanlawon
 *
 * Gets all microservice admins.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getAllMsAdmins = async (req, res, next) => {
  //get all admins mapping the field names appropriately
  let admins, allMsAdmins;
  const { filter } = req.query;

  let query = {};
  const { page, limit } = req.paginateOptions;

  try {
    if (filter === "disabled") {
      admins = await getDeletedRecords(MsAdmin, page, limit);
    } else if (filter === "all") {
      admins = await getAllRecords(MsAdmin, page, limit);
    } else {
      admins = await MsAdmin.paginate(query, req.paginateOptions);
    }

    allMsAdmins = admins.docs.map((admin) => {
      return {
        msAdminId: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
        isDisabled: admin.deleted || false,
      };
    });
  } catch (error) {
    console.log(error.message);
    next(new CustomError(400, "An error occured retrieving admin accounts"));
    return;
  }

  // Set page info.
  let pageInfo = {
    currentPage: admins.page,
    totalPages: admins.totalPages,
    hasNext: admins.hasNextPage,
    hasPrev: admins.hasPrevPage,
    nextPage: admins.nextPage,
    prevPage: admins.prevPage,
    pageRecordCount: admins.docs.length,
    totalRecord: admins.totalDocs,
  };

  let data = {
    records: allMsAdmins,
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
    responseHandler(res, 200, data, `MsAdmins Retrieved Successfully`);
  }
};

module.exports = getAllMsAdmins;
