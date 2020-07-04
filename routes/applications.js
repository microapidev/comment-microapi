const router = require("express").Router();
const applicationController = require("../controller/applicationsController");

router.get(
  "organizations/:organizationId/applications/:applicationId",
  applicationController.getSingleApplication
);

module.exports = router;
