const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  reply_body: {
    type: String,
    required: true,
  },
  comment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comments" },
  upVotes: {
    type: Number,
    default: 0,
  },
  downVotes: {
    type: Number,
    default: 0,
  },
  isFlagged: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
});

const Reply = mongoose.model("Reply", ReplySchema);
module.exports = Reply;
