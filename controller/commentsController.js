// UNCOMMENT EACH MODEL HERE AS NEEDED

const Replies = require("../models/replies");
const Comments = require("../models/comments");
const User = require("../models/users");

exports.getComments = (req, res, next) => {
  Comments.find()
    .populate("replies")
    .populate("users")
    .then((response) => {
      res.status(200).json({ comments: response });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong, try again",
        error: err.message,
      });
    });
};

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.commentId;
  const user = req.body.email;

  Comments.findById(comment_id)
    .exec()
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      } else {
        User.findOne({ email: user })
          .then((e) => {
            if (!e) {
              res
                .status(403)
                .json({ message: "Unauthorized or User does not exist" });
            } else {
              Comments.deleteOne({ _id: comment_id })
                .then(() => {
                  Replies.deleteMany({ comment_id: comment_id });
                })
                .then(() => {
                  return res.status(200).json({ message: "Comment deleted" });
                });
            }
          })
          .catch((err) => {
            res.status(400).json({
              message: "Oops, invalid resource url",
              error: err.message,
            });
          });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Oops, something went wrong", error: err });
    });
};
