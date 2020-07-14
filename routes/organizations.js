const router = require("express").Router();
const organizationsController = require("../controllers/organizationsController");
const validMW = require("../middleware/validation");
const {
  createOrganizationSchema,
  getOrganizationTokenSchema,
  deleteOrganizationSchema,
} = require("../utils/validationRules");

/**
 * POST routes
 */
router.post(
  "/",
  validMW(createOrganizationSchema),
  organizationsController.createSingleOrganization
);
router.post(
  "/token",
  validMW(getOrganizationTokenSchema),
  organizationsController.getSingleOrganizationToken
);
/**
 * DELETE ROUTE
 */
router.delete(
  "/:organizationId",
  validMW(deleteOrganizationSchema),
  organizationsController.deleteSingleOrganization
);

module.exports = router;
