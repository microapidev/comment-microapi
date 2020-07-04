const router = require("express").Router();
const orgCtrl = require("../controller/organizationsController");

//create a new organization
router.post("/", orgCtrl.createOrganization);

//login/get organization token
router.post("/token", orgCtrl.getOrganizationToken);

module.exports = router;
