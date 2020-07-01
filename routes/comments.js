const repliesRoutes = require("./replies");
const router = require("express").Router();
const validationMiddleware = require("../middleware/validation");
const validationRules = require("../utils/validationRules");
const commentController = require("../controller/commentsController");
const { appAuthMW } = require("../middleware/auth");

router.use(appAuthMW);

// routes for a comment's reply
router.use("/:commentId/replies", repliesRoutes);

// creates a comment
router.post("/", commentController.create);

// updates a comment
router.patch(
  "/:commentId",
  validationMiddleware.default(validationRules.updateCommentSchema),
  commentController.updateComment
);

// deletes a comment
router.delete("/:commentId", commentController.deleteComment);

// upvotes a comment
router.patch("/:commentId/votes/upvote", commentController.upvoteComment);

// downvotes a comment
router.patch("/:commentId/votes/downvote", commentController.downvoteComment);

// flags a comment (toggle)
router.patch("/:commentId/flag", commentController.flagComment);

module.exports = router;
