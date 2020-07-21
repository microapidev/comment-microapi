const RateLimit = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");

const mongoStore = new MongoStore({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  uri: process.env.DB_URI,
});

const planRatesLimiter = new RateLimit({
  store: mongoStore,
  windowMs: 60 * 1000 * 60 * 24, //max requests duration 24 hours
  max: (req) => {
    //get plan maximum requests from token
    return req.token.maxRequestsPerDay || process.env.defaultMaxRequestsPerDay;
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
});

planRatesLimiter.store = mongoStore;

module.exports = planRatesLimiter;
