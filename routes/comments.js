const repliesRoutes = require("./replies");
const router = require("express").Router();
const Comment = require("../controller/commentsController");

router.get("/api/v1/comments/refs/:id", Comment.userByComment);

router.use("/comments/replies", repliesRoutes);

module.exports = router;
