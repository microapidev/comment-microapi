const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applicationsController");
const deleteSingleApplication = require("../controllers/applicationsController/deleteSingleApplication");

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
router.delete("/:applicationId", deleteSingleApplication);

module.exports = router;
