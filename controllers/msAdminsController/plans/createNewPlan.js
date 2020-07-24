//utilities
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");

//models
const MsAdminModel = require("../../../models/msadmins");
const PlansModel = require("../../../models/plans");

/**
 * @author Ekeyekwu Oscar
 *
 * Subscribes an application to a plan.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const createNewPlan = async (req, res, next) => {
  const { msAdminId } = req.token;
  const {
    name,
    logging,
    maxLogRetentionPeriod,
    maxRequestPerMin,
    maxRequestPerDay,
    period,
  } = req.body;

  try {
    //check if msAdmin exists
    const msAdmin = await MsAdminModel.findById(msAdminId);
    if (!msAdmin) {
      next(
        new CustomError("401", "You are not authorized to access this resource")
      );
      return;
    }

    //collate plan data
    const planData = {
      name,
      logging,
      maxLogRetentionPeriod,
      maxRequestPerMin,
      maxRequestPerDay,
      period,
    };
    //create plan
    const newPlan = new PlansModel(planData);
    await newPlan.save();

    if (!newPlan) {
      next(new CustomError(400, "Error saving new plan ..."));
    }
    const createdPlan = {
      planId: newPlan._id,
      planName: newPlan.name,
      logging: Boolean(newPlan.logging),
      maxLogRetentionPeriod: newPlan.maxLogRetentionPeriod,
      maxRequestPerMin: newPlan.maxRequestPerMin,
      maxRequestPerDay: newPlan.maxRequestPerDay,
    };

    responseHandler(res, 201, createdPlan);
  } catch (error) {
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = createNewPlan;
