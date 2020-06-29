const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  ownerId: {
    // field used for emails, userId from the applcation used to identify its users
    type: String,
    required: true,
  },
  content: {
    // field contains comment body
    type: String,
    required: true,
  },
  replies: [{ type: Schema.Types.ObjectId, ref: "Replies" }], // array of replies
  flags: [
    // contains array of ownerId allowing only one flag per user
    {
      type: String, // array of ownerId
    },
  ],
  upVotes: [
    // contains array of ownerId allowing only one vote per user either up or neither
    // push ownerId onto array to vote, remove from array to unvote
    {
      type: String, // array of ownerId
    },
  ],
  downVotes: [
    // contains array of ownerId allowing only one vote per user down or neither
    // push ownerId onto array to vote, remove from array to unvote
    {
      type: String, // array of ownerId
    },
  ],
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comments" },
});

const Reply = mongoose.model("Replies", ReplySchema);
module.exports = Reply;
