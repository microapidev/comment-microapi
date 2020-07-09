const router = require("express").Router();
const { orgAuthMW } = require("../middleware/auth");
const adminController = require("../controllers/adminsController");
const validMW = require("../middleware/validation");
const validationRules = require("../utils/validationRules");

//--- DO NOT TOUCH ---
//Must always be at the top to decode/guard routes
router.use(orgAuthMW);

/**
 * POST routes
 */
router.post(
  "/",
  validMW(validationRules.createSingleAdminSchema),
  adminController.createSingleAdmin
);
router.post(
  "/change-password",
  validMW(validationRules.changeAdminPasswordSchema),
  adminController.changeAdminPassword
);

/**
 * GET routes
 */
router.get(
  "/",
  validMW(validationRules.getAllAdminsSchema),
  adminController.getAllAdmins
);
router.get(
  "/:adminId",
  validMW(validationRules.getSingleAdminSchema),
  adminController.getSingleAdmin
);

/**
 * PATCH routes
 */
router.patch(
  "/",
  validMW(validationRules.updateSingleAdminSchema),
  adminController.updateSingleAdmin
);

/**
 * DELETE routes
 */

router.delete(
  "/comments",
  validMW(validationRules.adminDeleteCommentSchema),
  adminController.adminDeleteComment
);

router.delete(
  "/:adminId",
  validMW(validationRules.deleteSingleAdminSchema),
  adminController.deleteSingleAdmin
);

router.delete(
  "/comments/:commentId",
  validMW(deleteSingleCommentSchema),
  adminController.deleteSingleComment
);

router.delete(
  "/comments/:commentId/replies/:replyId",
  validMW(deleteSingleReplySchema),
  adminController.deleteSingleReply
);

module.exports = router;
