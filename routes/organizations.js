const router = require("express").Router({ mergeParams: true });
// const validationMiddleware = require("../middleware/validation");
// const validationRules = require("../utils/validationRules");
const organizationsController = require("../controller/organizationsController");

// creates an organization in the database
router.post("/", organizationsController.createOrganization);

module.exports = router;
