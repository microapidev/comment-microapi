const CustomError = require("../utils/customError");

const queryLimitMW = (req, res, next) => {
  //get limit peck config
  const limitPeck = 50;
  //check if GET request
  if (req.method === "GET") {
    //check if req.limit is set
    if (req.params.limit) {
      try {
        if (parseInt(req.params.limit, 10) > limitPeck) {
          req.params.limit = limitPeck.toString();
          res.json({
            message: `Limit Pecked at ${limitPeck}`,
          });
        }
      } catch (error) {
        next(CustomError(422, "Invalid limit specified"));
      }
    }
  }
  next();
};

module.exports = queryLimitMW;
