const router = require("express").Router();
const msAdminsPlanCtrl = require("../../controllers/msAdminsController/plans");
const validMW = require("../../middleware/validation");
const validationRules = require("../../utils/validationRules").msAdmins;
const planValidationRule = require("../../utils/validationRules/applications/getAllPlansSchema");

/**
 * POST routes
 */
router.post(
  "/",
  validMW(validationRules.createNewPlanSchema),
  msAdminsPlanCtrl.createNewPlan
);

/**
 * Get Routes
 */
router.get("/", validMW(planValidationRule), msAdminsPlanCtrl.getAllPlans);
router.get(
  "/:planId",
  validMW(validationRules.plansSchema),
  msAdminsPlanCtrl.getSinglePlan
);

/**
 * Delete route
 */
router.delete(
  "/:planId",
  validMW(validationRules.plansSchema),
  msAdminsPlanCtrl.deleteSinglePlan
);
module.exports = router;
