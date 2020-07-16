const express = require("express");
const settingsCtrl = require("../../controllers/msAdminsController/settings");
const validMW = require("../../middleware/validation");
const validationRules = require("../../utils/validationRules");
const { superAdminMW } = require("../../middleware/auth");

const router = express.Router();

//------------SUPERADMIN Routes---------------
//middleware to block non-superadmin roles
router.use(superAdminMW);

//GET system settings
router.get(
  "/",
  validMW(validationRules.getSystemSettings),
  settingsCtrl.getSystemSettings
);

module.exports = router;
