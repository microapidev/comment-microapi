const repliesRoutes = require("./replies");
const router = require("express").Router();

router.use("/:commentId/replies", repliesRoutes);

module.exports = router;
