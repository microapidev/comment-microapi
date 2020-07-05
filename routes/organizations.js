const router = require("express").Router();
const organizationsController = require("../controllers/organizationsController");

/**
 * POST routes
 */
router.post("/", organizationsController.createSingleOrganization);
router.post("/token", organizationsController.getSingleOrganizationToken);

module.exports = router;
