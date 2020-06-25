const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  comment_origin: String,
  reportId: {
    type: Number,
    default: 0,
  },
  flag: {
    type: Boolean,
    default: false,
  },
  numOfFlags: {
    type: Number,
    default: 0,
  },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  upVotes: {
    type: Number,
    default: 0,
  },
  downVotes: {
    type: Number,
    default: 0,
  },
  isFlagged: Boolean,
  user: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
}, {timestamps:true});
const Comment = mongoose.model('Comments', CommentSchema);
module.exports = Comment;
