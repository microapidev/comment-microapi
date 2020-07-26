const RequestLog = require("../../models/requestLogs");
const Application = require("../../models/applications");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

const getSingleApplicationLog = async (req, res, next) => {
  const { applicationId } = req.params;

  const { organizationId } = req.token;
  const { page = 1 } = req.query; //default to page 1 if not specified

  //reuse this controller for msAdmins, they can find any application
  if (req.token.msAdminId) {
    const application = Application.findById(applicationId);
    if (!application) {
      return next(new CustomError(404, "Application not found"));
    }
  } else {
    //check if requested application belongs to organization of admin user
    const application = Application.find({
      _id: applicationId,
      organizationId,
    });
    if (!application) {
      return next(new CustomError(404, "Application not found"));
    }
  }

  //get all logs for application - logPageSize will come from system settings
  const pageSize = process.env.logPageSize || 100;
  const requestLog = await RequestLog.paginate(
    { applicationId },
    {
      page,
      limit: pageSize,
      select: "-__v -maxLogRetention",
      sort: { createdAt: "desc" },
    }
  );

  const pageInfo = {
    currentPage: requestLog.page,
    totalPages: requestLog.totalPages,
    hasNext: requestLog.hasNextPage,
    hasPrev: requestLog.hasPrevPage,
    nextPage: requestLog.nextPage,
    prevPage: requestLog.prevPage,
    pageRecordCount: requestLog.docs.length,
    totalRecord: requestLog.totalDocs,
  };

  const records = requestLog.docs;

  const data = { records, pageInfo };

  //return log details
  return responseHandler(
    res,
    200,
    data,
    "Application log retrived successfully"
  );
};

module.exports = getSingleApplicationLog;
