const router = require("express").Router();
const msAdminsOrgsCtrl = require("../../controllers/msAdminsController/organizations");
const validMW = require("../../middleware/validation");
const { paginateOptionsMW } = require("../../middleware/pagination");
const validationRules = require("../../utils/validationRules").msAdmins;

// GET Applications
router.get(
  "/:organizationId/applications",
  validMW(validationRules.organizationsSchema),
  msAdminsOrgsCtrl.getOrganizationsApps
);

//get all organizations
router.get(
  "/",
  validMW(validationRules.getAllOrganizationsSchema),
  paginateOptionsMW,
  msAdminsOrgsCtrl.getAllOrganizations
);

//get single organization
router.get(
  "/:organizationId",
  validMW(validationRules.organizationsSchema),
  msAdminsOrgsCtrl.getSingleOrganization
);

//soft delete routes
router.patch(
  "/:organizationId/block",
  validMW(validationRules.organizationsSchema),
  msAdminsOrgsCtrl.blockSingleOrganization
);
//restore blocked organization
router.patch(
  "/:organizationId/unblock",
  validMW(validationRules.organizationsSchema),
  msAdminsOrgsCtrl.unblockSingleOrganization
);

//delete organization
router.delete(
  "/:organizationId",
  validMW(validationRules.organizationsSchema),
  msAdminsOrgsCtrl.deleteSingleOrganization
);

module.exports = router;
