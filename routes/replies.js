const router = require("express").Router({ mergeParams: true });
const repliesController = require("../controller/repliesController");

router.get("/", repliesController.getCommentReplies);
router.post("/", repliesController.createReply);
router.patch("/:replyId/votes/downvote", repliesController.downvoteReply);
module.exports = router;
