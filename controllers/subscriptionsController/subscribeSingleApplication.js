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
  let isSubscribed, appSubscription;
  //util function to return new date incrementally
  const newDateUtil = (oldDate, totalPeriod) => {
    let newDate = new Date(oldDate.toLocaleString()).setMonth(
      oldDate.getMonth() + totalPeriod
    );
    return newDate;
  };
  function deactivateAll(planProperty) {
    isSubscribed[planProperty].forEach((item) => {
      item.isActive = false;
    });
  }

  //add subscription to History
  async function addSubToHistory(
    appId,
    planId,
    totalPeriod,
    expiryDate,
    subDate,
    subId
  ) {
    const subHistoryData = {
      applicationId: appId,
      planId: planId,
      period: `${totalPeriod} months`,
      expiresOn: expiryDate,
      subscribedOn: subDate,
      subscriptionId: subId,
    };

    //save to subscription history
    const subHistory = new SubscriptionHistoryModel(subHistoryData);
    await subHistory.save();
  }

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
      _id: applicationId,
      organizationId: organizationId,
    });
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
    const totalPeriod = parseInt(
      parseInt(plan.periodWeight, 10) * parseInt(periodCount, 10),
      10
    );
    const subscriptionDate = new Date();
    const expiryDate = new Date().setMonth(
      subscriptionDate.getMonth() + totalPeriod
    );

    isSubscribed = await SubscriptionsModel.findOne({
      applicationId: applicationId,
    });

    //check for existing app subsription
    if (isSubscribed) {
      const plans = [
        { plan: "logging", planName: "maxLogRetentionPeriod" },
        { plan: "dailyLimits", planName: "maxRequestPerDay" },
        { plan: "perMinuteLimits", planName: "maxRequestPerMin" },
      ];

      plans.forEach((item) => {
        const planProperty = item.plan;
        const planName = item.planName;

        const checkAndUpdate = isSubscribed[planProperty].find((currPlan) => {
          if (parseInt(currPlan[planName]) === parseInt(plan[planName])) {
            let oldDate = new Date(currPlan.expiryDate.toLocaleString());
            let curDate = new Date();
            let newDate;
            if (oldDate.getDate() < curDate.getDate()) {
              newDate = new Date(expiryDate.toLocaleString());
            } else {
              newDate = newDateUtil(currPlan["expiryDate"], totalPeriod);
            }
            //deactive all existing plans and set only new one to true
            deactivateAll(planProperty);
            currPlan[planName] = plan[planName];
            currPlan["expiryDate"] = new Date(newDate);
            currPlan["isActive"] = true;
            return true;
          }
        });

        if (!checkAndUpdate) {
          isSubscribed[planProperty].forEach((currPlan) => {
            currPlan[planName] = plan[planName];
            currPlan["expiryDate"] = expiryDate;
            currPlan["isActive"] = true;
            isSubscribed[planProperty].push(currPlan);
          });
        }
      });
      await isSubscribed.save();
      await addSubToHistory(
        applicationId,
        planId,
        totalPeriod,
        expiryDate,
        subscriptionDate,
        isSubscribed._id
      );
      return responseHandler(
        res,
        201,
        isSubscribed,
        "Application subscription upgrade successful"
      );
    } else {
      //create subscription data & properties objects
      //logging object
      const logging = {
        value: plan.logging,
        maxLogRetentionPeriod: plan.maxLogRetentionPeriod,
        expiryDate,
      };

      //request per min object
      const perMinuteLimits = {
        maxRequestsPerMin: plan.maxRequestPerMin,
        expiryDate,
      };

      //request per day object
      const dailyLimits = {
        maxRequestsPerDay: plan.maxRequestPerDay,
        expiryDate,
      };

      const subDetails = {
        planName: plan.name,
        planId: plan._id,
        subscriptionStartDate: subscriptionDate,
        applicationId: applicationId,
        logging: logging,
        dailyLimits: dailyLimits,
        perMinuteLimits: perMinuteLimits,
      };

      // create  subscription
      appSubscription = new SubscriptionsModel(subDetails);
      appSubscription.save();

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
        applicationId: appSubscription.applicationId,
        planId: appSubscription.planId,
        planName: appSubscription.planName,
        subscriptionStartDate: appSubscription.subscriptionStartDate,
        logging: appSubscription.logging,
        perMinuteLimits: appSubscription.perMinuteLimits,
        dailyLimits: appSubscription.dailyLimits,
      };
      await addSubToHistory(
        applicationId,
        planId,
        totalPeriod,
        expiryDate,
        subscriptionDate,
        appSubscription._id
      );
      return responseHandler(
        res,
        201,
        appSubscriptionData,
        "Application subscription successful"
      );
    }
  } catch (error) {
    next(error);
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = subscribeSingleApplication;
