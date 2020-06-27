const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");

router.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Welcome",
    data: "This is the comments service api",
  });
});

router.patch("/:commentId/votes", commentController.voteComment);

router.use("/comments/replies", repliesRoutes);

module.exports = router;
