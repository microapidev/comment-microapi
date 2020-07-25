//utilities
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");

//models
const PlansModel = require("../../../models/plans");
const msAdminModel = require("../../../models/msadmins");

/**
 * @author Ekeyekwu Oscar
 *
 * deletes a plan.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const deleteSinglePlan = async (req, res, next) => {
  const { planId } = req.params;
  const { msAdminId } = req.token;
  try {
    //get all plans
    const plans = await PlansModel.findById(planId);

    if (!plans) {
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
    const deletedPlan = await PlansModel.findByIdAndDelete(planId);

    const deletedPlanData = {
      planId: deletedPlan._id,
      planName: deletedPlan.name,
    };

    responseHandler(res, 200, deletedPlanData, "Plan successfully deleted");
  } catch (error) {
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = deleteSinglePlan;
