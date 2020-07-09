const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Replies = require("./replies");

const CommentSchema = new Schema(
  {
    refId: String, // field used by applications to point to reference comment location in their app
    applicationId: {
      //the id of the application that this comment belongs to
      type: Schema.Types.ObjectId,
      ref: "Applications",
      required: true,
    },
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
    origin: String, // field is free for use by applications as seen fit
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
  },
  { timestamps: true }
);

CommentSchema.post("findOneAndDelete", async (comment) => {
  if (comment) {
    //delete any existing replies
    await Replies.deleteMany({ commentId: comment._id });
    // console.log(`Deleted ${replies.deletedCount} replies`);
  }
});

const Comment = mongoose.model("Comments", CommentSchema);
module.exports = Comment;
