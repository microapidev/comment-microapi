const repliesRoutes = require("./replies");
const router = require("express").Router();
const commentController = require("../controller/commentsController");
const commentsController = require("../controller/commentsController");
router.use("/:commentId/replies", repliesRoutes);

router.patch("/:commentId/flag", commentController.flagComment);

// Single configurable  route to get all comments, flagged and unflagged comments
// My intention was to use express-validate package, but couldn't get to work, I will look at this in the future
router.get("/:refs/:refId", function (req, res, next) {
  // flagged comments can be retreived by passing a query string eg. comments/refs/refId/?isFlagged=true
  if (req.query.isFlagged === "true") {
    return commentsController.getFlaggedComments(req, res, next);
  }
  // similarly unflagged comments can be retreived by passing a query string eg. /comments/refs/refId?isFlagged=false
  if (req.query.isFlagged === "false") {
    return commentsController.getUnFlaggedComments(req, res, next);
  }
  // all comments (flagged and unflagged) can be retreived by not passing a query string eg. /comments/refs/refId
  else {
    return commentsController.getComments(req, res, next);
  }
});

module.exports = router;
