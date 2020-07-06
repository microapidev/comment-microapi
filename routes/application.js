const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applicationsController");
const { createApplicationSchema } = require("../utils/validationRules");
const validMW = require("../middleware/validation");
const { orgAuthMW } = require("../middleware/auth");

//--- DO NOT TOUCH ---
//Must always be at the top to decode/guard routes
router.use(orgAuthMW);

/**
 * POST routes
 */
router.post(
  "/",
  validMW(createApplicationSchema),
  applicationsController.createSingleApplication
);

/**
 * GET routes
 */
router.get("/", applicationsController.getAllApplications);

/**
 * PATCH routes
 */

/**
 * DELETE routes
 */

module.exports = router;
