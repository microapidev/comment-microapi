const router = require("express").Router();
const msAdminsAppCtrl = require("../../controllers/msAdminsController/applications");
const validMW = require("../../middleware/validation");
const validationRules = require("../../utils/validationRules").msAdmins;

// GET Applications
router.get(
  "/applications",
  validMW(validationRules.getAllApplicationsSchema),
  msAdminsAppCtrl.getAllApplications
);
router.get(
  "/applications/:applicationId",
  validMW(validationRules.getSingleApplicationSchema),
  msAdminsAppCtrl.getSingleApplication
);

module.exports = router;
