//utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

//models
const MsAdmin = require("../../models/msadmins");
const SubscriptionModel = require("../../models/subscriptions");

/**
 * @author Ekeyekwu Oscar
 *
 * gets all application subscribed to a plan.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const getAllAppSubscriptions = async (req, res, next) => {
  const { msAdminId } = req.token;
  let query = {};
  try {
    //check if msadmin exists
    const msAdmin = await MsAdmin.findById(msAdminId);

    if (!msAdmin) {
      next(
        new CustomError(401, "You are not authorized to access this resource")
      );
      return;
    }

    //get all subscriptions from model
    const subscriptions = await SubscriptionModel.paginate(query, {
      ...req.pagination,
    });
    if (!subscriptions) {
      next(new CustomError(404, "No Subscription record found"));
      return;
    }

    const allSubscriptions = subscriptions.docs.map((subs) => {
      return {
        subscriptionId: subs._id,
        applicationId: subs.applicationId,
        planName: subs.planName,
        dailyLimits: subs.dailyLimits,
        perMinuteLimits: subs.perMinuteLimits,
        logging: subs.logging,
        subscriptionStartDate: subs.subscriptionStartDate,
      };
    });
    console.log(allSubscriptions[0].dailyLimits[0]);
    // Set page info.
    let pageInfo = {
      currentPage: subscriptions.page,
      totalPages: subscriptions.totalPages,
      hasNext: subscriptions.hasNextPage,
      hasPrev: subscriptions.hasPrevPage,
      nextPage: subscriptions.nextPage,
      prevPage: subscriptions.prevPage,
      pageRecordCount: subscriptions.docs.length,
      totalRecord: subscriptions.totalDocs,
    };

    let data = {
      records: allSubscriptions,
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
      responseHandler(
        res,
        200,
        data,
        `Application subscriptions retrieved successfully`
      );
    }
  } catch (error) {
    next(error);
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = getAllAppSubscriptions;
