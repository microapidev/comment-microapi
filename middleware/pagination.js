const CustomError = require("../utils/customError");

exports.queryLimitMW = (req, res, next) => {
  //get limit peck config
  const limitPeck = 50;
  //check if GET request
  if (req.method === "GET") {
    //check if req.limit is set
    if (req.query.limit) {
      if (parseInt(req.query.limit, 10) > limitPeck) {
        req.query.limit = limitPeck.toString();
        return next(
          new CustomError(
            422,
            `Invalid limit specified. Query Limit Pecked at ${limitPeck}`
          )
        );
      }
    }
  }
  next();
};
