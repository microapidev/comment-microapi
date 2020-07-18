const router = require("express").Router();
const msAdminsAppCtrl = require("../../controllers/msAdminsController/applications");
const validMW = require("../../middleware/validation");
const validationRules = require("../../utils/validationRules").msAdmins;

// GET Applications
router.get(
  "/",
  validMW(validationRules.getAllApplicationsSchema),
  msAdminsAppCtrl.getAllApplications
);
router.get(
  "/:applicationId",
  validMW(validationRules.getSingleApplicationSchema),
  msAdminsAppCtrl.getSingleApplication
);

//Block Application
router.patch(
  "/:applicationId/block",
  validMW(validationRules.blockApplicationSchema),
  msAdminsAppCtrl.blockSingleApplication
);

module.exports = router;
