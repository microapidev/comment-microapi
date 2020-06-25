const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  reply_body: {
    type: String,
    required: true,
  },
  comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments' },
  upVotes: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Users"
  }],
  downVotes: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  }],
  isFlagged: Boolean,
});

const Reply = mongoose.model('Reply', ReplySchema);
module.exports = Reply;
