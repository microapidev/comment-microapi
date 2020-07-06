const repliesRoutes = require("./replies");
const router = require("express").Router();
const validationMiddleware = require("../middleware/validation");
const validationRules = require("../utils/validationRules");
const commentsController = require("../controllers/commentsController");
const { appAuthMW } = require("../middleware/auth");
const mongoose = require("mongoose");
const { generateToken } = require("../utils/auth/tokenGenerator");

// -------- DO NOT TOUCH!!! ---------
// Dummy tokens for now. We will remove in production
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

// -------- DO NOT TOUCH --------------
// authentication middleware must be at the top
router.use(appAuthMW);

router.use("/:commentId/replies", repliesRoutes);

/**
 * POST routes
 */
router.post(
  "/",
  validationMiddleware(validationRules.createCommentSchema),
  commentsController.createSingleComment
);

/**
 * GET routes
 */
router.get(
  "/",
  validationMiddleware(validationRules.getAllCommentsSchema),
  commentsController.getAllComments
);

router.get(
  "/:commentId",
  validationMiddleware(validationRules.getSingleCommentSchema),
  commentsController.getSingleComment
);

router.get(
  "/:commentId/votes",
  validationMiddleware(validationRules.getCommentVotesSchema),
  commentsController.getSingleCommentVotes
);

/**
 * PATCH routes
 */
router.patch(
  "/:commentId",
  validationMiddleware(validationRules.updateCommentSchema),
  commentsController.updateSingleComment
);

router.patch("/:commentId/flag", commentsController.updateSingleCommentFlags);

router.patch(
  "/:commentId/votes/upvote",
  validationMiddleware(validationRules.updateCommentUpAndDownVoteSchema),
  commentsController.updateSingleCommentUpVotes
);

router.patch(
  "/:commentId/votes/downvote",
  validationMiddleware(validationRules.updateCommentUpAndDownVoteSchema),
  commentsController.updateSingleCommentDownVotes
);

/**
 * DELETE routes
 */
router.delete(
  "/:commentId",
  validationMiddleware(validationRules.deleteCommentSchema),
  commentsController.deleteSingleComment
);

router.get(
  "/:commentId",
  validationMiddleware(
    validationRules.getSingleCommentSchema,
    commentsController.getSingleComment
  )
);

module.exports = router;
