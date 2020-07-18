const router = require("express").Router();
const msAdminsAppCtrl = require("../../controllers/msAdminsController/applications");
const validMW = require("../../middleware/validation");
const validationRules = require("../../utils/validationRules").msAdmins;

// GET Applications
router.get(
  "/",
  validMW(validationRules.getAllApplicationsSchema),
  msAdminsAppCtrl.getAllApplications
);
router.get(
  "/:applicationId",
  validMW(validationRules.getSingleApplicationSchema),
  msAdminsAppCtrl.getSingleApplication
);

//Block & Unblock Application
router.patch(
  "/:applicationId/block",
  validMW(validationRules.blockApplicationSchema),
  msAdminsAppCtrl.blockSingleApplication
);

router.patch(
  "/:applicationId/unblock",
  validMW(validationRules.blockApplicationSchema),
  msAdminsAppCtrl.unblockSingleApplication
);

//delete applicationId
router.delete(
  "/:applicationId",
  validMW(validationRules.deleteApplicationSchema),
  msAdminsAppCtrl.deleteSingleApplication
);
module.exports = router;
