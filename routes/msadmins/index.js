const express = require("express");
const applicationsRoute = require("./applications");
const msAdminsCtrl = require("../../controllers/msAdminsController");
const validMW = require("../../middleware/validation");
const validationRules = require("../../utils/validationRules").msAdmins;
const { sysAuthMW } = require("../../middleware/auth");
const superAdminRoutes = require("./superadmin");
const systemSettingsRoutes = require("./settings");

const router = express.Router();

// ------- Unguarded/open routes ----------
router.post(
  "/login",
  validMW(validationRules.loginAdminSchema),
  msAdminsCtrl.loginSysAdmin
);

// --------- DONT TOUCH!!! -------------
//apply middleware at top of chain
router.use(sysAuthMW);

/**
 * POST routes
 */

router.post(
  "/create",
  validMW(validationRules.createSingleMsAdminSchema),
  msAdminsCtrl.createSingleMsAdmin
);

router.post(
  "/change-password",
  validMW(validationRules.changeMsAdminPasswordSchema),
  msAdminsCtrl.changeMsAdminPassword
);

/**
 * PATCH routes
 */
router.patch(
  "/",
  validMW(validationRules.updateSingleMsAdminSchema),
  msAdminsCtrl.updateSingleMsAdmin
);
router.use(applicationsRoute);

router.use("/settings", systemSettingsRoutes);
router.use(superAdminRoutes);


module.exports = router;
