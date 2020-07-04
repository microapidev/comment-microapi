const router = require("express").Router();
const { orgAuthMW } = require("../middleware/auth");
const adminCtrl = require("../controller/adminsController");

//--- DO NOT TOUCH ---
//Must always be at the top to decode/guard routes
router.use(orgAuthMW);

router.post("/", adminCtrl.createAdmin);

module.exports = router;
