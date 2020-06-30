const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");
const { appAuthMW } = require("../middleware/auth");

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

// Single configurable  route to get all comments, flagged and unflagged comments
// My intention was to use express-validate package, but couldn't get to work, I will look at this in the future
router.get("/get_comments", commentController.getComments);

module.exports = router;
