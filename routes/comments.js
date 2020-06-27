const repliesRoutes = require("./replies");
const router = require("express").Router();

router.use("/comments/replies", repliesRoutes);

module.exports = router;
