const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");

router.use("/:commentId/replies", repliesRoutes);

//create comment
router.post("/", commentController.create);

router.patch("/:commentId/flag", commentController.flagComment);
module.exports = router;
