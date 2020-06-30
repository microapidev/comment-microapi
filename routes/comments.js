const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");

router.use("/:commentId/replies", repliesRoutes);

// update comment
router.patch("/:commentId", commentController.updateComment);

// delete comment
router.delete("/:commentId", commentController.deleteComment);

// flag comment
router.patch("/:commentId/flag", commentController.flagComment);

module.exports = router;
