const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");

router.use("/:commentId/replies", repliesRoutes);

//delete comments
router.delete("/comments/:commentId", commentController.deleteComment);

router.patch("/:commentId/flag", commentController.flagComment);
module.exports = router;
