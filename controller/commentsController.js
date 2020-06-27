
// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require('../models/replies');
const Comments = require('../models/comments');
const User = require('../models/users');


exports.getComments = async (req, res, next) => {
  try{
  	await Comments.find({})
    .populate('replies')
    .populate('users')
    .then((comments) => {
      res.status(200).json({
        status: "success",
        message: `all comments retrieved for expense report `,
        data: comments
      });
    })
    .catch(next);
  }catch(err){
    res.status(401).json({
        status: "error",
        message: `Something went wrong`,
        data: err
      });
  }
};

exports.getFlaggedComments = async (req, res, next) => {
  try{
    await Comments.find({isFlagged: true})
    .populate('replies')
    .populate('users')
    .then((comments) => {
       res.status(200).json({
        status: "success",
        message: `All flagged comments retrieved for expense report `,
        data: comments
      });
    })
    .catch(next);
  }catch(err){
    res.status(401).json({
        status: "error",
        message: `Something went wrong`,
        data: err
      });
  }
};

exports.getUnFlaggedComments = async (req, res, next) => {
  try{
    await Comments.find({isFlagged: false})
    .populate('replies')
    .populate('users')
    .then((comments) => {
      res.status(200).json({
        status: "success",
        message: `Unflagged comments retrieved for expense report `,
        data: comments
      });
    })
    .catch(next);
  }catch(err){
    res.status(401).json({
        status: "error",
        message: `Something went wrong`,
        data: err
      });
  }
};



// const Replies = require("../models/replies");
// const Comments = require('../models/comments');
// const User = require("../models/users");

// exports.getComments = (res, req, next) => {
//   Comments.find({}).populate('replies').populate('users').then(response=>{
//       return res.status(200).json({})
//   });
// };

