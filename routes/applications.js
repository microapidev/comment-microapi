const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applicationsController");
const subscriptionController = require("../controllers/subscriptionsController");
const validationRules = require("../utils/validationRules");
const validMW = require("../middleware/validation");
const { orgAuthMW } = require("../middleware/auth");

//--- DO NOT TOUCH ---
//Must always be at the top to decode/guard routes
router.use(orgAuthMW);

/**
 * POST routes
 */
// get token for an application
router.post(
  "/:applicationId/token",
  validMW(validationRules.getApplicationTokenSchema),
  applicationsController.getApplicationToken
);
router.post(
  "/",
  validMW(validationRules.createApplicationSchema),
  applicationsController.createSingleApplication
);

/**
 * GET routes
 */
router.get(
  "/",
  validMW(validationRules.getAllApplicationsSchema),
  applicationsController.getAllApplications
);

router.get(
  "/:applicationId",
  validMW(validationRules.getSingleApplicationSchema),
  applicationsController.getSingleApplication
);

/**
 * PATCH routes
 */
router.patch(
  "/:applicationId",
  validMW(validationRules.updateApplicationSchema),
  applicationsController.updateSingleApplication
);

/**
 * DELETE routes
 */
router.delete(
  "/:applicationId",
  validMW(validationRules.deleteApplicationSchema),
  applicationsController.deleteSingleApplication
);

/**
 * Subscription routes
 */
router.get(
  "/:applicationId/subscriptions",
  validMW(validationRules.getSingleAppSubscriptionSchema),
  subscriptionController.getSingleAppSubscription
);

router.post(
  "/:applicationId/subscriptions",
  validMW(validationRules.subscribeSingleApplicationSchema),
  subscriptionController.subscribeSingleApplication
);

module.exports = router;
