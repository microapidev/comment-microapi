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

// creates a comment
router.post("/", commentController.create);

// updates a comment
router.patch("/:commentId", commentController.updateComment);

router.get("/:commentId/votes", commentController.getCommentVotes);

// deletes a comment
router.delete("/:commentId", commentController.deleteComment);

// upvotes a comment
router.patch("/:commentId/votes/upvote", commentController.upvoteComment);

// downvotes a comment
router.patch("/:commentId/votes/downvote", commentController.downvoteComment);

// flags a comment (toggle)
router.patch("/:commentId/flag", commentController.flagComment);

module.exports = router;
