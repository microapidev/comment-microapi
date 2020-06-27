const router = require("express").Router();
const Comment = require("../controller/commentsController");

router.get("/api/v1/comments/refs/:id", Comment.userByComment);

module.exports = router;
