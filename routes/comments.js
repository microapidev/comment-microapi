const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");

router.use("/:commentId/replies", repliesRoutes);

//using the commentId as a query paramerter in the route
router.delete("comment/:userId", commentController.deleteComment);

router.patch("/:commentId/flag", commentController.flagComment);
module.exports = router;
