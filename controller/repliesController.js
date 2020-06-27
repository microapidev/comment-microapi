// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require("../models/replies");
const Comments = require("../models/comments");

exports.getRepliesToComment = (req, res, next) => {
  const comment_Id = req.params.commentId;
  Comments.findById(comment_Id)
    .exec()
    .then((comment) => {
      if (!comment) {
        res.status(404).json({ message: "Comment not found" });
      } else {
        if (comment.replies.length < 1 || !comment.replies) {
          res
            .status(404)
            .json({ message: "No replies found for this comment" });
        } else {
          Replies.find({ comment_id: comment_Id })
            .exec()
            .then(replies => {
              res.status(200).json(replies)
            })
        }
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong, please try again",
        error: err.message,
      });
    });
};