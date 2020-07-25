const router = require("express").Router({ mergeParams: true });
const validationMiddleware = require("../middleware/validation");
const validationRules = require("../utils/validationRules");
const repliesController = require("../controllers/repliesController");
const { queryLimitMW, paginateOptionsMW } = require("../middleware/pagination");

/**
 * POST routes
 */
router.post(
  "/",
  validationMiddleware(validationRules.createReplySchema),
  repliesController.createSingleReply
);

/**
 * GET routes
 */
router.get(
  "/",
  validationMiddleware(validationRules.getAllRepliesSchema),
  paginateOptionsMW,
  queryLimitMW,
  repliesController.getAllReplies
);

router.get(
  "/:replyId",
  validationMiddleware(validationRules.getSingleReplySchema),
  repliesController.getSingleReply
);

router.get(
  "/:replyId/votes",
  validationMiddleware(validationRules.getReplyVotesSchema),
  repliesController.getSingleReplyVotes
);

/**
 * PATCH routes
 */
router.patch(
  "/:replyId",
  validationMiddleware(validationRules.updateReplySchema),
  repliesController.updateSingleReply
);

router.patch(
  "/:replyId/votes/upvote",
  validationMiddleware(validationRules.updateReplyUpAndDownVoteSchema),
  repliesController.updateSingleReplyUpVotes
);

router.patch(
  "/:replyId/votes/downvote",
  validationMiddleware(validationRules.updateCommentUpAndDownVoteSchema),
  repliesController.updateSingleReplyDownVotes
);

router.patch(
  "/:replyId/flag",
  validationMiddleware(validationRules.updateReplyFlagSchema),
  repliesController.updateSingleReplyFlags
);

/**
 * DELETE routes
 */
router.delete(
  "/:replyId",
  validationMiddleware(validationRules.deleteReplySchema),
  repliesController.deleteSingleReply
);

module.exports = router;
