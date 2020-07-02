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

// Create routes
router.post("/", commentController.createSingleComment);

// Delete routes
router.delete("/:commentId", commentController.deleteSingleComment);

// Get routes
router.get("/", commentController.getAllComments);

router.get("/:commentId", commentController.getSingleComment);

router.get("/:commentId/votes", commentController.getSingleCommentVotes);

// Patch routes
router.patch("/:commentId", commentController.updateSingleComment);

router.patch(
  "/:commentId/votes/upvote",
  commentController.updateSingleCommentUpVotes
);

router.patch(
  "/:commentId/votes/downvote",
  commentController.updateSingleCommentDownVotes
);

router.patch("/:commentId/flag", commentController.updateSingleCommentFlags);

module.exports = router;
