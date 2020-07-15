const express = require("express");
const { sysAuthMW } = require("../middleware/auth");
const msAdminsCtrl = require("../controllers/msAdminsController");
const validMW = require("../middleware/validation");
const validationRules = require("../utils/validationRules").msAdmins;
const CustomError = require("../utils/customError");

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

//------------SUPERADMIN Routes---------------

//middleware to prevent non-superadmins to the routes below
router.use((req, res, next) => {
  if (req.token.role !== "superadmin") {
    return next(new CustomError(401, "Unauthorized access. Access denied!"));
  }

  next();
});

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
