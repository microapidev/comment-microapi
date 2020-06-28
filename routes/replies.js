const router = require('express').Router();
const commentController = require('../controller/commentsController');

router.get('/', function (req, res) {
  res.send('hello');
});
module.exports = router;
