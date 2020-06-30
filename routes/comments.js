const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");
const { appAuthMW } = require("../middleware/auth");

router.use(appAuthMW);
router.use("/:commentId/replies", repliesRoutes);

//delete comments
router.delete("/:commentId", commentController.deleteComment);

router.patch("/:commentId/flag", commentController.flagComment);
module.exports = router;
