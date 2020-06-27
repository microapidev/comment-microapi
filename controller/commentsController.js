
// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require('../models/replies');
const Comments = require('../models/comments');
const User = require('../models/users');


exports.getReportComments = async (req, res, next) => {
	let report_id = req.params.report_id;
  	await Comments.find({reportId: report_id})
    .then((comments) => {
      res.status(200).json({
        status: "success",
        message: `comments retrieved for expense report ${report_id}`,
        data: comments
      });
    })
    .catch(next);
};

exports.getFlaggedReportComments = async (req, res, next) => {
  let report_id = req.params.report_id;
  	await Comments.find({reportId: report_id,  isFlagged: 1})
    .then((comments) => {
      res.status(200).json({
        status: "success",
        message: `Flagged comments retrieved for expense report ${report_id}`,
        data: comments
      });
    })
    .catch(next);
};

exports.getUnFlaggedReportComments = async (req, res, next) => {
  let report_id = req.params.report_id;
  	await Comments.find({reportId: report_id, isFlagged: 0})
    .then((comments) => {
      res.status(200).json({
        status: "success",
        message: `Unflagged comments retrieved for expense report ${report_id}`,
        data: comments
      });
    })
    .catch(next);
};


