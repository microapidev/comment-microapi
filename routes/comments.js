const router = require("express").Router();
const commentsController = require("../controller/commentsController");
const repliesRoutes = require("./replies");
router.use("/comments/replies", repliesRoutes);
// const validate = require("express-validator");

// Single configurable  route to get all comments, flagged and unflagged comments
// My intention was to use express-validate package, but couldn't get to work, I will look at this in the future
router.get("/", function (req, res, next) {
  // flagged comments can be retreived by passing a query string eg. /comments/?flagged or /comments/?flagged=true
  if (req.query.flagged === "" || req.query.flagged === "true") {
    return commentsController.getFlaggedComments(req, res, next);
  }
  // similarly unflagged comments can be retreived by passing a query string eg. /comments/?unflagged or /comments/?unflagged=true
  if (req.query.unflagged === "" || req.query.unflagged === "true") {
    return commentsController.getUnFlaggedComments(req, res, next);
  }
  // all comments can be retreived by not passing a query string eg. /comments/
  else {
    return commentsController.getComments(req, res, next);
  }
});

module.exports = router;
