const repliesRoutes = require("./replies");
const router = require("express").Router();
const validationMiddleware = require("../middleware/validation");
const validationRules = require("../utils/validationRules");
const commentController = require("../controller/commentsController");
const { appAuthMW } = require("../middleware/auth");
const mongoose = require("mongoose");
const { generateToken } = require("../utils/auth/tokenGenerator");

// -------- DO NOT TOUCH!!! ---------
//Dummy tokens for now. We will remove in production
router.use((req, res, next) => {
  if (process.env.DISABLE_AUTH === "true") {
    req.headers["authorization"] =
      "Bearer " +
      generateToken(
        {
          applicationId: mongoose.Types.ObjectId(),
        },
        process.env.APP_SECRET
      );
  }
  next();
});
// -------- DONT TOUCH --------------
// authentication middleware must be at the top
router.use(appAuthMW);

// reroute ../replies route requests to Replies router
router.use("/:commentId/replies", repliesRoutes);

// creates a comment
router.post(
  "/",
  validationMiddleware(validationRules.createCommentSchema),
  commentController.create
);

// updates a comment
router.patch(
  "/:commentId",
  validationMiddleware(validationRules.updateCommentSchema),
  commentController.updateComment
);

// get comment votes
router.get(
  "/:commentId/votes",
  validationMiddleware(validationRules.getCommentVotesSchema),
  commentController.getCommentVotes
);

// deletes a comment
router.delete(
  "/:commentId",
  validationMiddleware(validationRules.deleteCommentSchema),
  commentController.deleteComment
);

// upvotes a comment
router.patch(
  "/:commentId/votes/upvote",
  validationMiddleware(validationRules.updateCommentUpAndDownVoteSchema),
  commentController.upvoteComment
);

// downvotes a comment
router.patch(
  "/:commentId/votes/downvote",
  validationMiddleware(validationRules.updateCommentUpAndDownVoteSchema),
  commentController.downvoteComment
);

// flags a comment (toggle)
router.patch("/:commentId/flag", commentController.flagComment);

// Single configurable  route to get all comments, flagged and unflagged comments
// My intention was to use express-validate package, but couldn't get to work, I will look at this in the future
router.get(
  "/",
  validationMiddleware(validationRules.getAllCommentsSchema),
  commentController.getComments
);

module.exports = router;
