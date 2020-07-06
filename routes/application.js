const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applicationsController");

/**
 * POST routes
 */

router.post("/", applicationsController.createSingleApplication);

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
