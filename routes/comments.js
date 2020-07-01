const repliesRoutes = require("./replies");
const router = require("express").Router();
// const validationMiddleware = require("../middleware/validation");
// const validationRules = require("../utils/validationRules");
const commentController = require("../controller/commentsController");
const { appAuthMW } = require("../middleware/auth");

// -------- DO NOT TOUCH!!! ---------
// authentication middleware must be at the top
router.use(appAuthMW);

// reroute ../replies route requests to Replies router
router.use("/:commentId/replies", repliesRoutes);

router.post("/", commentController.create);
// update comment
router.patch("/:commentId", commentController.updateComment);
// creates a comment
router.post("/", commentController.create);

// updates a comment
router.patch("/:commentId", commentController.updateComment);

// get comment votes
router.get("/:commentId/votes", commentController.getCommentVotes);

// deletes a comment
router.delete("/:commentId", commentController.deleteComment);

// upvotes a comment
router.patch("/:commentId/votes/upvote", commentController.upvoteComment);

// downvotes a comment
router.patch("/:commentId/votes/downvote", commentController.downvoteComment);

// flags a comment (toggle)
router.patch("/:commentId/flag", commentController.flagComment);

// Single configurable  route to get all comments, flagged and unflagged comments
// My intention was to use express-validate package, but couldn't get to work, I will look at this in the future
router.get("", commentController.getComments);

module.exports = router;
