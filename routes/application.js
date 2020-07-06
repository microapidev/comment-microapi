const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applicationsController");
const { createApplicationSchema } = require("../utils/validationRules");
const validMW = require("../middleware/validation");

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
