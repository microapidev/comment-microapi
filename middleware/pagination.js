const CustomError = require("../utils/customError");

/**
 * @author Allistair Vilakazi <allistair.vilakazi@gmail.com>
 *
 * Sets pagination options.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
exports.paginateOptionsMW = (req, res, next) => {
  let paginateOptions = {};

  // Check if its a GET request.
  if (req.method === "GET") {
    const { limit, sort, page } = req.query;

    // Set record limit, if available.
    paginateOptions.limit = limit ? parseInt(limit, 10) : 20;

    // Set skip to next page, if available.
    paginateOptions.skip = (page - 1) * limit;

    // Set page option,if available.
    paginateOptions.page = page ? parseInt(page, 10) : 1;

    //set sort if available
    paginateOptions.sort = sort ? { createdAt: sort } : { createdAt: "asc" };
  }

  req.paginateOptions = paginateOptions;

  next();
};

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
