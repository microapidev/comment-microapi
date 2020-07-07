const router = require("express").Router();
const { orgAuthMW } = require("../middleware/auth");
const adminController = require("../controllers/adminsController");
const validMW = require("../middleware/validation");
const {
  changeAdminPasswordSchema,
  createSingleAdminSchema,
  updateSingleAdminSchema,
  deleteSingleAdminSchema,
  getAllAdminsSchema,
  getSingleAdminSchema,
} = require("../utils/validationRules");

//--- DO NOT TOUCH ---
//Must always be at the top to decode/guard routes
router.use(orgAuthMW);

/**
 * POST routes
 */
router.post(
  "/",
  validMW(createSingleAdminSchema),
  adminController.createSingleAdmin
);
router.post(
  "/change-password",
  validMW(changeAdminPasswordSchema),
  adminController.changeAdminPassword
);

/**
 * GET routes
 */
router.get("/", validMW(getAllAdminsSchema), adminController.getAllAdmins);
router.get(
  "/:adminId",
  validMW(getSingleAdminSchema),
  adminController.getSingleAdmin
);

/**
 * PATCH routes
 */
router.patch(
  "/",
  validMW(updateSingleAdminSchema),
  adminController.updateSingleAdmin
);

/**
 * DELETE routes
 */
router.delete(
  "/:adminId",
  validMW(deleteSingleAdminSchema),
  adminController.deleteSingleAdmin
);

module.exports = router;
