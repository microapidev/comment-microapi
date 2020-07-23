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
 * Subscribes an application to a plan.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */

const getSingleAppSubscription = async (req, res, next) => {
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
    const application = await ApplicationModel.findById(applicationId);
    if (!application) {
      next(new CustomError("404", "Application not found"));
      return;
    }

    //get application subscription
    const appSubscription = await SubscriptionModel.findOn({
      applicationId: applicationId,
    }).sort({ createdAt: "desc" });
    if (!appSubscription) {
      next(new CustomError(404, "No Subscription for this application Yet."));
      return;
    }
    //populate subscriptionData
    const appSubscriptionData = {
      subscriptionId: appSubscription._id,
      applicationId: appSubscription.applicationId,
      planId: appSubscription.planId,
      period: appSubscription.period.toLowerCase(),
      expiresOn: appSubscription.expiryDate,
      subscribedOn: appSubscription.subscriptionDate,
    };

    responseHandler(res, 200, appSubscriptionData);
  } catch (error) {
    console.log(error.message);
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = getSingleAppSubscription;
