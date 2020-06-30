const router = require("express").Router({ mergeParams: true });
const repliesController = require("../controller/repliesController");

// gets all replies of a comment
router.get("/", repliesController.getCommentReplies);

// gets a single reply of a comment
router.get("/:replyId", repliesController.getASingleReply);

// creates a reply to a comment
router.post("/", repliesController.createReply);

// gets all votes of a reply
router.get("/:replyId/votes", repliesController.getReplyVotes);

module.exports = router;
