const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applicationsController");
const { orgAuthMW } = require("../middleware/auth");

router.use(orgAuthMW);

/**
 * POST routes
 */
router.post("/", applicationsController.createSingleApplication);
// get token for an application
router.post(
  "/:applicationId/token",
  applicationsController.getApplicationToken
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
