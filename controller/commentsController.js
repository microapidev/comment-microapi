// UNCOMMENT EACH MODEL HERE AS NEEDED

// const Replies = require("../models/replies");

const Comments = require("../models/comments");
const User = require("../models/users");
const errHandler = require("../utils/errorhandler");

exports.voteComment = async (req, res) => {
  try {
    const _id = req.params.commentId;
    const { voteType, email } = req.body;
    await Comments.findById({ _id }).then(async (comments) => {
      try {
        let numOfUpVotes = 0;
        let numOfDownVotes = 0;
        if (voteType === "upvote") numOfUpVotes += 1;
        if (voteType === "downvote") numOfDownVotes += 1;
        const total = numOfUpVotes + numOfDownVotes;
        const data = {
          commentId: _id,
          total_votes: total,
          upvotes: numOfUpVotes,
          downvotes: numOfDownVotes,
        };
        comments.voteType = voteType;
        comments.totalVotes = total;
        const user = await User.findOne({ email });
        if (voteType === "upvote") comments.upVotes.push(user);
        if (voteType === "downvote") comments.downVotes.push(user);
        res.json({
          message: "Comment Voted Successfully!",
          response: "Ok",
          data: data,
        });
      } catch (err) {
        errHandler(err, res);
      }
    });
  } catch (err) {
    errHandler(err, res);
  }
};
