const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");
const { appAuthMW } = require("../middleware/auth");

// -------- DO NOT TOUCH!!! ---------
// authentication middleware must be at the top
router.use(appAuthMW);

// reroute ../replies route requests to Replies router
router.use("/:commentId/replies", repliesRoutes);

// upvote a comment
router.patch("/:commentId/votes/upvote", commentController.upvoteComment);

// downvote comment
router.patch("/:commentId/votes/downvote", commentController.downvoteComment);

// create a comment
router.post("/", commentController.create);

// update comment
router.patch("/:commentId", commentController.updateComment);

// delete comment
router.delete("/:commentId", commentController.deleteComment);

// flag comment
router.patch("/:commentId/flag", commentController.flagComment);

//get a single comment
router.get("/:commentId", commentController.getComment);

module.exports = router;
