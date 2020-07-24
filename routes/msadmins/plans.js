const router = require("express").Router();
const msAdminsPlanCtrl = require("../../controllers/msAdminsController/plans");
const validMW = require("../../middleware/validation");
const validationRules = require("../../utils/validationRules").msAdmins;

/**
 * POST routes
 */
router.post(
  "/",
  validMW(validationRules.createNewPlanSchema),
  msAdminsPlanCtrl.createNewPlan
);

module.exports = router;
