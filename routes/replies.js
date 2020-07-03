const router = require("express").Router({ mergeParams: true });
const validationMiddleware = require("../middleware/validation");
const validationRules = require("../utils/validationRules");
const repliesController = require("../controller/repliesController");

// gets all replies of a comment
router.get(
  "/",
  validationMiddleware(validationRules.getAllRepliesSchema),
  repliesController.getCommentReplies
);

// gets a single reply of a comment
router.get(
  "/:replyId",
  validationMiddleware(validationRules.getSinlgeReplySchema),
  repliesController.getASingleReply
);

// updates a reply of a comment
router.patch(
  "/:replyId",
  validationMiddleware(validationRules.updateReplySchema),
  repliesController.updateReply
);

// creates a reply to a comment
router.post(
  "/",
  validationMiddleware(validationRules.createReplySchema),
  repliesController.createReply
);

// downvote a reply
router.patch(
  "/:replyId/votes/downvote",
  validationMiddleware(validationRules.updateCommentUpAndDownVoteSchema),
  repliesController.downvoteReply
);

// gets all votes of a reply
router.get(
  "/:replyId/votes",
  validationMiddleware(validationRules.getReplyVotesSchema),
  repliesController.getReplyVotes
);

/// updates the flags of a reply
router.patch("/:replyId/flag", repliesController.flagCommentReplies);

// delete a reply
router.delete(
  "/:replyId",
  validationMiddleware(validationRules.deleteReplySchema),
  repliesController.deleteCommentReply
);

module.exports = router;
