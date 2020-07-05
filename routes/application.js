const express = require("express");
const router = express.Router();
const applicationController = require("../controller/applicationsController");

router.get("/", applicationController.getAllApplications);

module.exports = router;
