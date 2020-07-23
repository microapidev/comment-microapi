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

const subscribeSingleApplication = async (req, res, next) => {
  const { applicationId, planId } = req.params;
  const { organizationId } = req.token;
  const { period } = req.body;

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

    //calculate subscription expiry date
    const subscriptionDate = new Date();
    const expireOn = new Date();
    let expiryDate =
      period.toLowerCase() === "monthly"
        ? new Date(expireOn.setMonth(subscriptionDate.getMonth() + 1))
        : new Date(expireOn.setYear(subscriptionDate.getFullYear() + 1));

    //populate subscriptionData
    const subscriptionData = {
      applicationId: applicationId,
      planId: planId,
      period: period.toLowerCase(),
      expiresOn: expiryDate,
      subscribedOn: subscriptionDate,
    };

    const subscribedApplication = new SubscriptionModel(subscriptionData);
    await subscribedApplication.save();

    if (!subscribedApplication) {
      next(
        new CustomError(
          400,
          "An error occured subscribing application to this service"
        )
      );
      return;
    }

    responseHandler(res, 201, subscriptionData);
  } catch (error) {
    console.log(error.message);
    next(new CustomError(500, "Something went wrong, please try again..."));
    return;
  }
};

module.exports = subscribeSingleApplication;
