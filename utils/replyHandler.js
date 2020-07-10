module.exports = (reply) => {
  return {
    replyId: reply._id.toString(),
    commentId: reply.commentId.toString(),
    ownerId: reply.ownerId,
    content: reply.content,
    numOfVotes: reply.upVotes.length + reply.downVotes.length,
    numOfUpVotes: reply.upVotes.length,
    numOfDownVotes: reply.downVotes.length,
    numOfFlags: reply.flags.length,
  };
};
