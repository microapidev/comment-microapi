const router = require("express").Router();
const repliesController = require("../controller/repliesController");

router.get("/", repliesController.getCommentReplies);
module.exports = router;
