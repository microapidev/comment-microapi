//utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

//models
const OrganizationModel = require("../../models/organizations");
const ApplicationModel = require("../../models/applications");
const SubscriptionModel = require("../../models/subscriptionsHistory");
const SubUpgradeHistoryModel = require("../../models/subscriptions");
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
  const { period, periodCount, planId } = req.body;

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
    const application = await ApplicationModel.find({
      applicationId: applicationId,
      organizationId: organizationId,
    });
    if (!application) {
      next(new CustomError("404", "Application not found"));
      return;
    }

    //check if plan exists
    const plan = await PlanModel.findById(planId);
    console.log(plan);
    if (!plan) {
      next(new CustomError(404, "Plan not found!"));
      return;
    }

    //calculate subscription expiry date
    const subscriptionDate = new Date();
    const expireOn = new Date();
    let expiryDate =
      period.toLowerCase() === "monthly"
        ? new Date(expireOn.setMonth(subscriptionDate.getMonth() + periodCount))
        : new Date(
            expireOn.setYear(subscriptionDate.getFullYear() + periodCount)
          );

    //populate subscriptionData
    const subscriptionData = {
      applicationId: applicationId,
      planId: planId,
      period: period.toLowerCase(),
      periodCount: periodCount,
      expiresOn: expiryDate,
      subscribedOn: subscriptionDate,
    };

    console.log(subscriptionData);
    const subscribedApplication = new SubscriptionModel(subscriptionData);
    await subscribedApplication.save();

    //create subscription data for history/upgrade
    const subDetails = {
      planName: plan.name,
      planId: plan._id,
      subscriptionId: subscribedApplication._id,
      applicationId: applicationId,
      loggingEnabled: Boolean(plan.loggingEnabled),
      requestPerMin: plan.requestPerMin,
      logRetentionPeriod: plan.maxLogRetentionPeriod,
      requestPerDay: plan.requestPerDay,
      loggingExpiryDate: expiryDate,
      requestPerMinExpiryDate: expiryDate,
      logRetentionPeriodExpiryDate: expiryDate,
      requestPerDayExpiryDate: expiryDate,
      subscriptionExpiryDate: expiryDate,
      subscriptionStartDate: subscriptionDate,
    };

    //add subscription to history
    const initUpgradeHistory = new SubUpgradeHistoryModel(subDetails);
    await initUpgradeHistory.save();

    if (!subscribedApplication) {
      next(
        new CustomError(
          400,
          "An error occured subscribing application to this service"
        )
      );
      return;
    }
    //collate subscribedApp Data
    const subscribedAppData = {
      subscribtionId: subscribedApplication._id,
      subUpgradeHistoryId: initUpgradeHistory._id,
      applicationId: subscribedApplication.applicationId,
      plan: subscribedApplication.planId,
      period: subscribedApplication.period,
      periodCount: subscribedApplication.periodCount,
      expiresOn: subscribedApplication.expiresOn,
      subscribedOn: subscribedApplication.subscribedOn,
    };

    console.log(subscribedAppData);
    responseHandler(res, 201, subscribedAppData);
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = subscribeSingleApplication;
