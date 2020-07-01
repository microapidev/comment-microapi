const router = require("express").Router({ mergeParams: true });
const repliesController = require("../controller/repliesController");

// gets all replies of a comment
router.get("/", repliesController.getCommentReplies);

//upvotes a reply
router.patch("/:replyId/votes/upvote", repliesController.upvoteReply);
// gets a single reply of a comment
router.get("/:replyId", repliesController.getASingleReply);

// creates a reply to a comment
router.post("/", repliesController.createReply);

// gets all votes of a reply
router.get("/:replyId/votes", repliesController.getReplyVotes);

/// updates the flags of a reply
router.patch("/:replyId/flag", repliesController.flagCommentReplies);

module.exports = router;
