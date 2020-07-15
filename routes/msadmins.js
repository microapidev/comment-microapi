const express = require("express");
const { sysAuthMW } = require("../middleware/auth");
const msAdminsCtrl = require("../controllers/msAdminsController");
const validMW = require("../middleware/validation");
const validationRules = require("../utils/validationRules").msAdmins;

const router = express.Router();

// ------- Unguarded routes ----------
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

/**
 * GET routes
 */

/**
 * PATCH routes
 */

/**
 * DELETE routes
 */

module.exports = router;
