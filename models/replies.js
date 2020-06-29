const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  replyBody: {
    type: String,
    required: true,
  },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comments" },
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
  isFlagged: Boolean,
  users: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

const Reply = mongoose.model("Replies", ReplySchema);
module.exports = Reply;
