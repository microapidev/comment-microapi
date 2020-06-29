const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    refId: Number,
    commentBody: {
      type: String,
      required: true,
    },
    commentOwnerName: {
      type: String,
      required: true,
    },
    commentOwnerEmail: {
      type: String,
      required: true,
    },
    commentOrigin: String,
    isFlagged: { type: Boolean, default: false },
    numOfFlags: {
      type: Number,
      default: 0,
    },
    replies: [{ type: Schema.Types.ObjectId, ref: "Replies" }],
    upVotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    downVotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    commentOwner: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comments", CommentSchema);
module.exports = Comment;
