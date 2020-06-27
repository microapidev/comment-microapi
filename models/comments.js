const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    comment_body: {
      type: String,
      required: true,
    },
    comment_origin: String,
    isFlagged: { type: Boolean, default: false },
    numOfFlags: {
      type: Number,
      default: 0,
    },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
    },
    totalVotes: {
      type: Number,
    },
    upVotes: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
      },
    ],
    downVotes: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
      },
    ],
    user: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comments", CommentSchema);
module.exports = Comment;
