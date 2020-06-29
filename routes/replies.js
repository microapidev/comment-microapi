const router = require("express").Router({ mergeParams: true });
const repliesController = require("../controller/repliesController");

router.get("/", repliesController.getCommentReplies);
router.get("/:replyId", repliesController.getASingleReply);
module.exports = router;
