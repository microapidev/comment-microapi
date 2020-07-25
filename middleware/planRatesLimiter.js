const RateLimit = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");
const mongoose = require("mongoose");
require("../utils/dbParams");

const mongoStore = new MongoStore({
  collection: mongoose.connection.collection("RateLimits"),
});

const planRatesLimiter = new RateLimit({
  store: mongoStore,
  windowMs: 60 * 1000 * 60 * 24, //max requests duration 24 hours
  max: (req) => {
    //get plan maximum requests from token
    if (req.token) {
      return (
        req.token.maxRequestsPerDay || process.env.defaultMaxRequestsPerDay
      );
    }

    return process.env.defaultMaxRequestsPerDay;
  },
  message: {
    status: 429,
    error: "Maximum requests in 24 hours, please try again later",
  },
  keyGenerator: (req) => {
    // place limits on application
    const key = req.token.applicationId;
    return key;
  },
  skip: () => {
    //globally disable request limits
    if (
      process.env.disableRequestLimits === undefined ||
      process.env.disableRequestLimits.toLowerCase() === "false"
    )
      return false;
    return true;
  },
});

planRatesLimiter.store = mongoStore;

module.exports = planRatesLimiter;
