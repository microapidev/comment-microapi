const repliesRoutes = require("./replies");
const router = require("express").Router();
const {
  deleteComment,
  getComments,
} = require("../controller/commentsController");
const { getRepliesToComment } = require('../controller/repliesController');

router.get("/", getComments);

router.get("/:commentId/replies", getRepliesToComment);

router.delete("/:commentId", deleteComment);

router.use("/comments/replies", repliesRoutes);

module.exports = router;
