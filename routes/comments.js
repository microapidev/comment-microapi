const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");
const { appAuthMW } = require("../middleware/auth");

router.use(appAuthMW);
router.use("/:commentId/replies", repliesRoutes);

// get single comment
router.get("/:commentId", commentController.getSingleComment);

// update comment
router.patch("/:commentId", commentController.updateComment);

// delete comment
router.delete("/:commentId", commentController.deleteComment);

// flag comment
router.patch("/:commentId/flag", commentController.flagComment);

module.exports = router;
