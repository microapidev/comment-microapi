const router = require("express").Router();
const { orgAuthMW } = require("../middleware/auth");
const adminController = require("../controllers/adminsController");

//--- DO NOT TOUCH ---
//Must always be at the top to decode/guard routes
router.use(orgAuthMW);

/**
 * POST routes
 */
router.post("/", adminController.createSingleAdmin);
router.post("/change-password", adminController.changeAdminPassword);

/**
 * GET routes
 */
router.get("/", adminController.getAllAdmins);
router.get("/:adminId", adminController.getSingleAdmin);

/**
 * PATCH routes
 */
router.patch("/", adminController.updateSingleAdmin);

/**
 * DELETE routes
 */
router.delete("/:adminId", adminController.deleteSingleAdmin);

module.exports = router;
