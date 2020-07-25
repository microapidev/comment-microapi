//utilities
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");

//models
const PlansModel = require("../../../models/plans");
const msAdminModel = require("../../../models/msadmins");

/**
 * @author Ekeyekwu Oscar
 *
 * get single plan.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const getSinglePlan = async (req, res, next) => {
  const { planId } = req.params;
  const { msAdminId } = req.token;
  try {
    //get plan
    const plan = await PlansModel.findById(planId);

    if (!plan) {
      next(new CustomError(404, "Plan not found ."));
      return;
    }

    const msAdmin = await msAdminModel.findById(msAdminId);
    if (!msAdmin) {
      next(
        new CustomError(401, "You are not authorized to access this resource.")
      );
      return;
    }

    const singlePlanData = {
      planId: plan._id,
      planName: plan.name,
      logging: plan.logging,
      maxLogRetentionPeriod: plan.maxLogRetentionPeriod,
      maxRequestPerMin: plan.maxRequestPerMin,
      maxRequestPerDay: plan.maxRequestPerDay,
      periodWeight: plan.periodWeight,
    };

    responseHandler(res, 200, singlePlanData, "Plan retrieved successfully");
  } catch (error) {
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = getSinglePlan;
