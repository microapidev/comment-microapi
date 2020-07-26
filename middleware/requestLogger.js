const url = require("url");
const RequestLog = require("../models/requestLogs");

exports.logWriter = async (
  applicationId,
  requestMethod,
  endpoint,
  responseCode,
  statusMessage,
  maxLogRetentionDays
) => {
  // save to DB
  const currentDate = new Date();
  const maxLogRetention = currentDate.setDate(
    currentDate.getDate() + maxLogRetentionDays
  );

  const requestLog = new RequestLog({
    applicationId,
    requestMethod,
    endpoint,
    responseCode,
    statusMessage,
    maxLogRetention,
  });

  await requestLog.save();

  return requestLog.id;
};

// logger middleware needs to placed after AppAuthMW
exports.requestLogger = (req, res, next) => {
  const applicationId = req.token.applicationId;
  const { logging = {} } = req.token;

  res.on("finish", () => {
    // check if logging is enabled globally
    const loggingEnabled = process.env.LOGGING_ENABLED
      ? process.env.LOGGING_ENABLED.toLowerCase() === "true"
      : false;

    try {
      if (loggingEnabled) {
        // get maxLogRetention and skipRanges 2XX, 3XX, 4XX, 5XX for status codes to skip
        // if application does not support logging, flush log after 1 day i.e 24hrs
        // and log all requests
        const { maxLogRetentionDays = 1, skipRanges = [] } = logging;

        // round status code to lower hundred to match 2XX, 3XX, 4XX....
        // TODO - this should probably be tied to a query param
        const statusRange = Math.floor(res.statusCode / 100) * 100;

        if (!skipRanges || !skipRanges.includes(statusRange)) {
          // not using async/await because we are not waiting for this promise to return
          exports
            .logWriter(
              applicationId,
              req.method,
              url.parse(req.originalUrl).pathname,
              res.statusCode,
              res.statusMessage,
              maxLogRetentionDays
            )
            .catch((error) => {
              console.log(
                `An error occured saving log to DB: ${error.message}`
              );
            });
        }
      }
    } catch (error) {
      next(error);
    }
  });

  next();
};
