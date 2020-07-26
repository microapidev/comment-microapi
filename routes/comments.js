const repliesRoutes = require("./replies");
const router = require("express").Router();
const validationMiddleware = require("../middleware/validation");
const validationRules = require("../utils/validationRules");
const commentsController = require("../controllers/commentsController");
const { appAuthMW } = require("../middleware/auth");
const { queryLimitMW, paginateOptionsMW } = require("../middleware/pagination");
const planRatesLimiter = require("../middleware/planRatesLimiter");
const { requestLogger } = require("../middleware/requestLogger");
// const mongoose = require("mongoose");
// const { generateToken } = require("../utils/auth/tokenGenerator");

// -------- DO NOT TOUCH!!! ---------
// Dummy tokens for now. We will remove in production
/* router.use((req, res, next) => {
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
}); */

// -------- DO NOT TOUCH --------------
// authentication middleware must be at the top
router.use(appAuthMW);

//add plan rates limiting middleware
router.use(planRatesLimiter);

// apply logger middleware to log requests of subscribed applications
router.use(requestLogger);

// go to replies routes
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
  paginateOptionsMW,
  queryLimitMW,
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
  validationMiddleware(validationRules.updateSingleCommentSchema),
  commentsController.updateSingleComment
);

router.patch(
  "/:commentId/flag",
  validationMiddleware(validationRules.updateSingleCommentFlagSchema),
  commentsController.updateSingleCommentFlags
);

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
