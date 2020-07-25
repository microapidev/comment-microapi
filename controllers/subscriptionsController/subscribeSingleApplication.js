//utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

//models
const OrganizationModel = require("../../models/organizations");
const ApplicationModel = require("../../models/applications");
const SubscriptionHistoryModel = require("../../models/subscriptionsHistory");
const SubscriptionsModel = require("../../models/subscriptions");
const PlanModel = require("../../models/plans");

/**
 * @author Ekeyekwu Oscar
 *
 * Subscribes an application to a plan.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const subscribeSingleApplication = async (req, res, next) => {
  const { applicationId } = req.params;
  const { organizationId } = req.token;
  const { periodCount, planId } = req.body;
  //util function to return new date incrementally
  const newDateUtil = (oldDate, totalPeriod) => {
    let newDate = new Date(oldDate.toLocaleString()).setMonth(
      oldDate.getMonth() + totalPeriod
    );
    return newDate;
  };

  try {
    //check if organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      next(
        new CustomError("401", "You are not authorized to access this resource")
      );
      return;
    }

    //check if application exists
    const application = await ApplicationModel.findById(applicationId);
    if (!application) {
      next(new CustomError("404", "Application not found"));
      return;
    }

    //check if plan exists
    const plan = await PlanModel.findById(planId);
    if (!plan) {
      next(new CustomError(404, "Plan not found!"));
      return;
    }

    //calculate subscription expiry date
    const totalPeriod = parseInt(parseInt(plan.periodWeight) * periodCount, 10);
    const subscriptionDate = new Date();
    const expiryDate = new Date().setMonth(
      subscriptionDate.getMonth() + totalPeriod
    );

    const isSubscribed = await SubscriptionsModel.findOne({
      applicationId: applicationId,
    });
    console.log(isSubscribed);
    console.log(plan);
    if (isSubscribed) {
      //check if subscription contains logging
      let logRetention = plan.maxLogRetentionDays;
      const logging = async function updateLogging(logRetention) {
        if (logRetention) {
          return isSubscribed.logging.forEach((log) => {
            //parse max log period into a number
            let fromPlan = parseInt(logRetention);
            if (parseInt(log.maxLogRetentionDays) === fromPlan) {
              log.maxLogRetentionDays += fromPlan;
              //check if expired already
              if (new Date(log.expiryDate).getMonth() < new Date().getMonth()) {
                log.expiryDate = expiryDate;
              } else {
                log.expiryDate = newDateUtil(log.expiryDate, totalPeriod);
              }
              //set new date incrementally
            } else {
              log.maxLogRetentionDays = fromPlan;
              log.expiryDate = expiryDate;
              log.isActive = true;
              isSubscribed.save();
            }
          });
        }
      };
      //check if perDays request is in plan
      if (plan.maxRequestPerDay) {
        isSubscribed.dailyLimits.forEach((dailyReqLim) => {
          if (dailyReqLim.maxRequestsPerDay === plan.maxRequestPerDay) {
            dailyReqLim.maxRequestsPerDay += plan.maxRequestPerDay;
            dailyReqLim.expiryDate = newDateUtil(
              dailyReqLim.expiryDate,
              totalPeriod
            );
            dailyReqLim.isActive = true;
          } else {
            dailyReqLim.maxRequestsPerDay = plan.maxRequestPerDay;
            dailyReqLim.expiryDate = expiryDate;
            dailyReqLim.isActive = true;
          }
        });
      }

      // //check if perMin request in plan
      // if (plan.maxRequestPerMin) {
      //   isSubscribed.perMinuteLimits.forEach((minReqLim) => {
      //     if (minReqLim.maxRequestsPerMin === plan.maxRequestPerMin) {
      //       minReqLim.maxRequestsPerMin += plan.maxRequestPerMin;
      //       minReqLim.expiryDate = newDateUtil(
      //         minReqLim.expiryDate,
      //         totalPeriod
      //       );
      //       minReqLim.isActive = true;
      //
      //     } else {
      //       minReqLim.maxRequestsPerMin = plan.maxRequestPerMin;
      //       minReqLim.expiryDate = expiryDate;
      //       minReqLim.isActive = true;
      //
      //     }
      //   });
      // }
    }

    console.log(isSubscribed);
    // //populate subscription History Data
    // const subscriptionHistoryData = {
    //   applicationId: applicationId,
    //   planId: planId,
    //   period: `${totalPeriod} months`,
    //   expiresOn: expiryDate,
    //   subscribedOn: subscriptionDate,
    // };

    // //save to subscription history
    // const subHistory = new SubscriptionHistoryModel(subscriptionHistoryData);
    //  subHistory.save();

    // //create subscription data & properties objects
    // //logging object
    // const logging = {
    //   value: plan.logging,
    //   maxLogRetentionDays: plan.maxLogRetentionPeriod,
    //   expiryDate,
    // };

    // //request per min object
    // const perMinuteLimits = {
    //   maxRequestsPerMin: plan.maxRequestPerMin,
    //   expiryDate,
    // };

    // //request per day object
    // const dailyLimits = {
    //   maxRequestsPerDay: plan.maxRequestPerDay,
    //   expiryDate,
    // };
    // const subDetails = {
    //   planName: plan.name,
    //   planId: plan._id,
    //   subscriptionHistoryId: subHistory._id,
    //   subscriptionStartDate: subscriptionDate,
    //   applicationId: applicationId,
    //   logging: logging,
    //   dailyLimits: dailyLimits,
    //   perMinuteLimits: perMinuteLimits,
    // };

    // //add subscription to history
    // const appSubscription = new SubscriptionsModel(subDetails);
    //  appSubscription.save();

    // if (!appSubscription) {
    //   next(
    //     new CustomError(
    //       400,
    //       "An error occured subscribing application to this service"
    //     )
    //   );
    //   return;
    // }
    // //collate subscribedApp Data
    // const appSubscriptionData = {
    //   subscribtionId: appSubscription._id,
    //   subscriptionHistoryId: appSubscription.subscriptionHistoryId,
    //   applicationId: appSubscription.applicationId,
    //   planId: appSubscription.planId,
    //   planName: appSubscription.planName,
    //   subscriptionStartDate: appSubscription.subscriptionStartDate,
    //   logging: appSubscription.logging,
    //   perMinuteLimits: appSubscription.perMinuteLimits,
    //   dailyLimits: appSubscription.dailyLimits,
    // };

    // console.log(appSubscriptionData);
    responseHandler(
      res,
      201,
      isSubscribed,
      "Application subscription successful"
    );
  } catch (error) {
    next(error);
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = subscribeSingleApplication;
