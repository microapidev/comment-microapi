const router = require("express").Router();
const orgCtrl = require("../controller/organizationsController");

//create a new organization
router.post("/", orgCtrl.createOrganization);

module.exports = router;
