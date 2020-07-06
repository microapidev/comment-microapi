const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applicationsController");
const deleteSingleApplication = require("../controllers/applicationsController/deleteSingleApplication");
const {
  createApplicationSchema,
  getAllApplicationsSchema,
} = require("../utils/validationRules");
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
router.get(
  "/",
  validMW(getAllApplicationsSchema),
  applicationsController.getAllApplications
);

/**
 * PATCH routes
 */

/**
 * DELETE routes
 */
router.delete("/:applicationId", deleteSingleApplication);

module.exports = router;
