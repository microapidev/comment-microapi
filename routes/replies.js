const router = require("express").Router({ mergeParams: true });
// const validationMiddleware = require("../middleware/validation");
// const validationRules = require("../utils/validationRules");
const repliesController = require("../controller/repliesController");

// gets all replies of a comment
router.get("/", repliesController.getCommentReplies);

// gets a single reply of a comment
router.get("/:replyId", repliesController.getASingleReply);

// updates a reply of a comment
router.patch("/:replyId", repliesController.updateReply);

// creates a reply to a comment
router.post("/", repliesController.createReply);

// downvote a reply
router.patch("/:replyId/votes/downvote", repliesController.downvoteReply);

// gets all votes of a reply
router.get("/:replyId/votes", repliesController.getReplyVotes);

/// updates the flags of a reply
router.patch("/:replyId/flag", repliesController.flagCommentReplies);

// delete a reply
router.delete("/:replyId", repliesController.deleteCommentReply);

module.exports = router;
