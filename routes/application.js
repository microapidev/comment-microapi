const router = require("express").Router();
const applicationController = require("../controller/ApplicationsController");

router.get(
  "/:organizationId/applications",
  applicationController.getAllApplications
);
