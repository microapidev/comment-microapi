const express = require("express");
const router = express.Router();
const { superAdminMW } = require("../../middleware/auth");
const validMW = require("../../middleware/validation");
const msAdminsCtrl = require("../../controllers/msAdminsController");
const validationRules = require("../../utils/validationRules").msAdmins;

//------------SUPERADMIN Routes---------------
//middleware to block non-superadmin roles
router.use(superAdminMW);

/**
 * GET routes
 */
router.get(
  "/",
  validMW(validationRules.getAllMsAdminsSchema),
  msAdminsCtrl.getAllMsAdmins
);

router.get(
  "/:msAdminId",
  validMW(validationRules.getSingleMsAdminSchema),
  msAdminsCtrl.getSingleMsAdmin
);

/**
 * PATCH routes
 */

router.patch(
  "/:msAdminId/enable",
  validMW(validationRules.enableDisableMsAdminSchema),
  msAdminsCtrl.enableDisableMsAdmin(false)
);

router.patch(
  "/:msAdminId/disable",
  validMW(validationRules.enableDisableMsAdminSchema),
  msAdminsCtrl.enableDisableMsAdmin(true)
);

/**
 * DELETE routes
 */

router.delete(
  "/:msAdminId",
  validMW(validationRules.deleteSingleMsAdminSchema),
  msAdminsCtrl.deleteSingleMsAdmin
);

module.exports = router;
