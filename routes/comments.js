const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");
const { appAuthMW } = require("../middleware/auth");

router.use(appAuthMW);
router.use("/:commentId/replies", repliesRoutes);

// get comment voteType(upVotes or downVotes);
router.get("/comments/:commentId/votes", commentController.getCommentVotes);

// update comment
router.patch("/:commentId", commentController.updateComment);

// delete comment
router.delete("/:commentId", commentController.deleteComment);

// flag comment
router.patch("/:commentId/flag", commentController.flagComment);

module.exports = router;
