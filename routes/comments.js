const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");
const { appAuthMW } = require("../middleware/auth");

// get vote comment
router.get("/comments/:commentId/votes", commentController.getCommentVote);

// upvote a comment
router.patch("/:commentId/votes/upvote", commentController.upvoteComment);

// downvote comment
router.patch("/:commentId/votes/downvote", commentController.downvoteComment);
router.use(appAuthMW);
router.use("/:commentId/replies", repliesRoutes);

router.post("/", commentController.create);
// update comment
router.patch("/:commentId", commentController.updateComment);

// delete comment
router.delete("/:commentId", commentController.deleteComment);

// flag comment
router.patch("/:commentId/flag", commentController.flagComment);

module.exports = router;
