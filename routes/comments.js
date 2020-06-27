const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");
const { getUnflaggedComments } = require("../controller/commentsController");

router.use("/:commentId/replies", repliesRoutes);
router.get("/unflagged", getUnflaggedComments);
router.patch("/:commentId/flag", commentController.flagComment);

module.exports = router;
