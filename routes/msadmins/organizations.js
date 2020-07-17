const router = require("express").Router();
const msAdminsOrgsCtrl = require("../../controllers/msAdminsController/organizations");
const validMW = require("../../middleware/validation");
const validationRules = require("../../utils/validationRules").msAdmins;

// GET Applications
router.get(
  "/organizations/:organizationId/applications",
  msAdminsOrgsCtrl.getOrganizationsApps
);

module.exports = router;
