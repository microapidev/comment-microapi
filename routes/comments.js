const repliesRoutes = require('./replies');
const router = require('express').Router();
const commentsController = require('../controller/commentsController');

router.use('/replies', repliesRoutes);
router.get('/:commentId/replies', commentsController.getCommentReplies);

module.exports = router;
