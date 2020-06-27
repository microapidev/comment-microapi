// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require("../models/replies");
const Comment = require("../models/comments");
const User = require("../models/users");
const CustomError = require("./../utils/customError");
// const responseHandler = require("./../utils/responseHandler");

// All method about the functionalities of comments
//  will written inside the module.export
module.exports = {
  userByComment: async (req, res) => {
    try {
      const user = req.params;
      const id = user.id;
      const userById = await User.findById(id).populate("comments");
      const commentId = await Comment.findById(id);
      const reply_id = await Replies.findById(id);
      if (!userById) return CustomError("Something is wrong");
      res.status(200).json({
        message: "success",
        response: "200",
        data: [
          {
            _id: commentId,
            ref: user.id,
            commentBody: commentId.commentBody,
            commendOwner: commentId.commendOwner,
            commendOwnerEmail: commentId.commendOwnerEmail,
            commentOrigin: commentId.commentOrigin,
            totalVotes: 0,
            upvotes: 0,
            downvotes: 0,
            replies: [
              {
                replyId: reply_id,
                commendId: commentId,
                replyBody: reply_id.replyBody,
                replyOwnerName: reply_id.replyOwnerName,
                replyOwnerEmail: reply_id.replyOwnerEmail,
                upvotes: 0,
                downvotes: 0,
              },
            ],
            repliesCount: 0,
          },
        ],
      });
    } catch (e) {
      res.status(400).json({
        status: "fail",
        message: e.message,
      });
    }
  },
};
