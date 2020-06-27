const router = require('express').Router();
const CommentsController = require('../controller/CommentsController');
const validate = require('express-validator');


router.get('/:report_id', function(req, res, next){

	if(req.query.flagged == ""){
	 	CommentsController.getFlaggedReportComments(req, res, next);
	}

	if(req.query.unflagged == ""){
	 	CommentsController.getUnFlaggedReportComments(req, res, next);
	}

	else{ 
		CommentsController.getReportComments(req, res, next);
	}
	
});

module.exports = router;
