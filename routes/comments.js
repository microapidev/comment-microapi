import repliesRoutes from "./replies";
const router = require("express").Router();

router.use("/comments/replies", repliesRoutes);

export default router;
