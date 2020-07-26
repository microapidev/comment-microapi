const SubscriptionModel = require("../models/subscriptions");

const getActiveSubscriptions = async (applicationId) => {
  const subscription = await SubscriptionModel.find({
    applicationId: applicationId,
  });
  console.log(subscription);
  if (!subscription) {
    console.log("No subscription for this Application");
  }
  //check for active subscriptions
  const plans = [
    { plan: "logging", planName: "maxLogRetentionPeriod" },
    { plan: "dailyLimits", planName: "maxRequestPerDay" },
    { plan: "perMinuteLimits", planName: "maxRequestPerMin" },
  ];

  let activeSubscriptions;
  plans.forEach((item) => {
    const planProperty = item.plan;

    activeSubscriptions = subscription[planProperty].map((item) => {
      if (item.isActive) {
        console.log(item);
        return item;
      }
    });
  });

  return {
    activeSubscriptions,
  };
};
getActiveSubscriptions("5f1d2d66046b714fb84983f3");
module.exports = getActiveSubscriptions;
