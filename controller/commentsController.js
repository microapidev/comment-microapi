// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");
const Comments = require("../models/comments");
const User = require("../models/users");
//const errHandler = require("../utils/errorhandler");

exports.voteComment = async (req, res) => {
  try {
    const id = req.params.commentId;
    console.log(id);
    const { voteType, email } = req.body;
    const comment = await Comments.findById({ _id: id });
    console.log(comment);
    if (voteType === "upvote") comment.totalVotes = comment.totalVotes + 1;
    const total = comment.totalVotes;
    comment.voteType = voteType;
    const userData = await User.findOne({ email });
    console.log(userData);
    if (voteType === "upvote") comment.upVotes.push(userData);
    if (voteType === "downvote") comment.downVotes.push(userData);
    comment.save();
    const data = {
      commentId: id,
      total_votes: total,
      upVotes: comment.upVotes,
      downVotes: comment.downVotes,
    };
    res.json({
      message: "Comment Voted Successfully!",
      response: "Ok",
      data: data,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
      data: [],
    });
  }
};
