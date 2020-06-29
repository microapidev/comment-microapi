const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");
const { updateComment } = require("../controller/commentsController");

router.use("/:commentId/replies", repliesRoutes);
router.patch("/:commentId", updateComment);
router.patch("/:commentId/flag", commentController.flagComment);
module.exports = router;
