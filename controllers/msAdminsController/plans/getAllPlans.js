//utilities
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");

//models
const PlansModel = require("../../../models/plans");

/**
 * @author Ekeyekwu Oscar
 *
 * gets all available plan.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const getAllPlans = async (req, res, next) => {
  try {
    //get all plans
    const plans = PlansModel.find();

    if (!plans) {
      next(new CustomError(404, "No Plan Found ..."));
    }
    const allPlans = plans.map((plan) => {
      return {
        planId: plan._id,
        planName: plan.name,
        logging: plan.logging,
        maxLogRetentionPeriod: plan.maxLogRetentionPeriod,
        maxRequestPerMin: plan.maxRequestPerMin,
        maxRequestPerDay: plan.maxRequestPerDay,
        periodWeight: plan.periodWeight,
      };
    });

    responseHandler(res, 201, allPlans);
  } catch (error) {
    next(error);
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = getAllPlans;
