const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");

router.patch("/:commentId/votes", commentController.voteComment);

router.use("/comments/replies", repliesRoutes);

module.exports = router;
