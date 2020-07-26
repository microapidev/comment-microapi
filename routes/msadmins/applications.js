const router = require("express").Router();
const msAdminsAppCtrl = require("../../controllers/msAdminsController/applications");
const appSubController = require("../../controllers/subscriptionsController");
const validMW = require("../../middleware/validation");
const { paginateOptionsMW } = require("../../middleware/pagination");
const validationRules = require("../../utils/validationRules").msAdmins;
const subValidationRule = require("../../utils/validationRules/subscriptions/getSingleAppSubscriptionSchema");

// GET Applications
router.get(
  "/",
  validMW(validationRules.getAllApplicationsSchema),
  paginateOptionsMW,
  msAdminsAppCtrl.getAllApplications
);

router.get(
  "/subscriptions",
  validMW(validationRules.getAllApplicationsSchema),
  paginateOptionsMW,
  appSubController.getAllAppSubscriptions
);
router.get(
  "/:applicationId",
  validMW(validationRules.getSingleApplicationSchema),
  msAdminsAppCtrl.getSingleApplication
);

router.get(
  "/:applicationId/subscriptions",
  validMW(subValidationRule),
  appSubController.getSingleAppSubscription
);
// reusing controller from applicationsController
router.get(
  "/:applicationId/log",
  validMW(validationRules.getSingleApplicationSchema),
  msAdminsAppCtrl.getSingleApplicationLog
);

//Block & Unblock Application
router.patch(
  "/:applicationId/block",
  validMW(validationRules.blockApplicationSchema),
  msAdminsAppCtrl.blockSingleApplication
);

router.patch(
  "/:applicationId/unblock",
  validMW(validationRules.blockApplicationSchema),
  msAdminsAppCtrl.unblockSingleApplication
);

//delete applicationId
router.delete(
  "/:applicationId",
  validMW(validationRules.deleteApplicationSchema),
  msAdminsAppCtrl.deleteSingleApplication
);
module.exports = router;
