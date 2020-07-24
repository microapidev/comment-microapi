const express = require("express");
const applicationsRoute = require("./applications");
const organizationsRoute = require("./organizations");
const plansRoute = require("./plans");
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
 * GET routes
 */
router.get(
  "/me",
  validMW(validationRules.getSelfMsAdminSchema),
  msAdminsCtrl.getSelfMsAdmin
);

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

router.use("/plans", plansRoute);
router.use("/organizations", organizationsRoute);
router.use("/applications", applicationsRoute);

router.use("/settings", systemSettingsRoutes);
router.use(superAdminRoutes);

module.exports = router;
