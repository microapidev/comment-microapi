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
    const totalPeriod = parseInt(plan.period * periodCount, 10);
    const subscriptionDate = new Date();
    const expiryDate = new Date().setMonth(
      subscriptionDate.getMonth() + totalPeriod
    );

    //populate subscription History Data
    const subscriptionHistoryData = {
      applicationId: applicationId,
      planId: planId,
      periodCount: `${totalPeriod} months`,
      expiresOn: expiryDate,
      subscribedOn: subscriptionDate,
    };

    //save to subscription history
    const subHistory = new SubscriptionHistoryModel(subscriptionHistoryData);
    await subHistory.save();

    //create subscription data & properties objects
    //logging object
    const logging = {
      value: plan.logging.value,
      expiryDate,
    };

    //log retention object
    const logRetentionPeriod = {
      value: plan.maxLogRetentionPeriod.value,
      expiryDate,
    };

    //request per min object
    const requestPerMin = {
      value: plan.maxRequestPerMin.value,
      expiryDate,
    };

    //request per day object
    const requestPerDay = {
      value: plan.maxRequestPerDay.value,
      expiryDate,
    };
    const subDetails = {
      planName: plan.name,
      planId: plan._id,
      subscriptionHistoryId: subHistory._id,
      subscriptionStartDate: subscriptionDate,
      applicationId: applicationId,
      logging: logging,
      requestPerMin: requestPerMin,
      logRetentionPeriod: logRetentionPeriod,
      requestPerDay: requestPerDay,
    };

    //add subscription to history
    const appSubscription = new SubscriptionsModel(subDetails);
    await appSubscription.save();

    if (!appSubscription) {
      next(
        new CustomError(
          400,
          "An error occured subscribing application to this service"
        )
      );
      return;
    }
    //collate subscribedApp Data
    const appSubscriptionData = {
      subscribtionId: appSubscription._id,
      subscriptionHistoryId: appSubscription.subscriptionHistoryId,
      applicationId: appSubscription.applicationId,
      plan: appSubscription.planId,
      planName: appSubscription.planName,
      subscriptionStartDate: appSubscription.subscriptionStartDate,
      logging: appSubscription.logging,
      requestPerMin: appSubscription.requestPerMin,
      logRetentionPeriod: appSubscription.logRetentionPeriod,
      requestPerDay: appSubscription.requestPerDay,
    };

    console.log(appSubscriptionData);
    responseHandler(res, 201, appSubscriptionData);
  } catch (error) {
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = subscribeSingleApplication;
