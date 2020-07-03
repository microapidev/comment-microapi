const router = require("express").Router();
const appController = require("../controller/applicationsController");

//create a new organization
//router.get("/", appController.getAllApplications);
router.patch("/:applicationId", appController.updateAppController);

module.exports = router;
