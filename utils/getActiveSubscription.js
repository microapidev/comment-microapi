const SubscriptionModel = require("./../models/subscriptions");

const getActiveSubscriptions = async (applicationId) => {
  console.log(applicationId);
  const subscription = await SubscriptionModel.find();
  console.log(subscription);
  if (!subscription) {
    console.log("No active subscription for this Application");
  }
  //check for active subscription
  const dailyLimits = subscription.dailyLimits.forEach((dailyLimitSub) => {
    if (dailyLimitSub.isActive) {
      return {
        maxRequestsPerDay: dailyLimitSub.maxRequestsPerDay,
        expiryDate: dailyLimitSub.expiryDate,
        id: dailyLimitSub._id,
      };
    }
  });

  const logging = subscription.logging.forEach((loggingSub) => {
    if (loggingSub.isActive) {
      return {
        maxLogRetentionDays: loggingSub.maxLogRetentionDays,
        value: loggingSub.value,
        expiryDate: loggingSub.expiryDate,
        id: loggingSub._id,
      };
    }
  });

  const perMinLimits = subscription.perMinuteLimits.forEach((perMinSub) => {
    if (perMinSub.isActive) {
      return {
        maxRequestsPerMin: perMinSub.maxRequestsPerMin,
        expiryDate: perMinSub.expiryDate,
        id: perMinSub._id,
      };
    }
  });

  return {
    dailyLimits,
    perMinLimits,
    logging,
  };
};

module.exports = getActiveSubscriptions;
