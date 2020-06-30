const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");

router.patch("/:commentId/votes", commentController.voteComment);
router.use("/:commentId/replies", repliesRoutes);

//delete comments
router.delete("/:commentId", commentController.deleteComment);

router.patch("/:commentId/flag", commentController.flagComment);
module.exports = router;
