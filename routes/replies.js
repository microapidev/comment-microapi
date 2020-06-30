const router = require("express").Router({ mergeParams: true });
const repliesController = require("../controller/repliesController");

router.get("/", repliesController.getCommentReplies);
router.post("/", repliesController.createReply);
router.patch("/:");
module.exports = router;
