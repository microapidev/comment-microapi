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

module.exports = router;
