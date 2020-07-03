const router = require("express").Router();

const applicationsController = require("../controller/applicationsController");

router.post("/", applicationsController.createApplication);

module.exports = router;
