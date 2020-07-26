//utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

//models
const OrganizationModel = require("../../models/organizations");
const ApplicationModel = require("../../models/applications");
const SubscriptionModel = require("../../models/subscriptions");

/**
 * @author Ekeyekwu Oscar
 *
 * deletes an application subscription
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const deleteAppSubscription = async (req, res, next) => {
  const { applicationId } = req.params;
  const { organizationId } = req.token;

  try {
    //check if organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      next(new CustomError("404", "Organization not found"));
      return;
    }

    //check if application exists
    const application = await ApplicationModel.findById({
      _id: applicationId,
      organizationId: organizationId,
    });
    if (!application) {
      next(new CustomError("404", "Application not found"));
      return;
    }

    //get application subscription
    const deletedSubscription = await SubscriptionModel.findOneAndDelete({
      applicationId: applicationId,
    });
    if (!deletedSubscription) {
      next(
        new CustomError(404, "Application subscription not found or deleted")
      );
      return;
    }
    //populate subscriptionData
    const deletedSubscriptionData = {
      subscriptionId: deletedSubscription._id,
    };

    responseHandler(
      res,
      200,
      deletedSubscriptionData,
      "Application subscription deleted successfully"
    );
  } catch (error) {
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = deleteAppSubscription;
