const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema(
  {
    ownerId: {
      // field used for emails, userId from the applcation used to identify its users
      type: String,
      required: true,
    },
    content: {
      // field contains reply body
      type: String,
      required: true,
    },
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
    commentId: {
      // ref to parent comment
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
      required: true,
    },
  },
  { timestamps: true }
);

const Reply = mongoose.model("Replies", ReplySchema);
module.exports = Reply;
