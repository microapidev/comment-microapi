const RateLimit = require("express-rate-limit");

const globalRateLimiter = new RateLimit({
  windowMs: 60 * 1000, //max requests in 1 min.
  max: () => {
    return process.env.maxRequestsPerMin;
  },
  message: {
    status: 429,
    error: "Too many requests per minute. Reduce your request rates",
  },
});

module.exports = globalRateLimiter;
