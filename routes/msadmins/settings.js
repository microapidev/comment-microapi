const express = require("express");
const settingsCtrl = require("../../controllers/msAdminsController/settings");
const validMW = require("../../middleware/validation");
const validationRules = require("../../utils/validationRules").msAdmins;
const { superAdminMW } = require("../../middleware/auth");

const router = express.Router();

//------------SUPERADMIN Routes---------------
//middleware to block non-superadmin roles
router.use(superAdminMW);

//GET system settings
router.get(
  "/",
  validMW(validationRules.getSystemSettingsSchema),
  settingsCtrl.getSystemSettings
);

//PATCH
router.patch(
  "/",
  validMW(validationRules.updateSystemSettingsSchema),
  settingsCtrl.updateSystemSettings
);

module.exports = router;
