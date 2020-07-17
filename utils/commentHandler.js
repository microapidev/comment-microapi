module.exports = (comment) => {
  return {
    commentId: String(comment._id),
    refId: comment.refId,
    applicationId: String(comment.applicationId),
    ownerId: comment.ownerId,
    content: comment.content,
    origin: comment.origin,
    numOfVotes: comment.upVotes.length + comment.downVotes.length,
    numOfUpVotes: comment.upVotes.length,
    numOfDownVotes: comment.downVotes.length,
    numOfFlags: comment.flags.length,
    numOfReplies: comment.replies.length,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  };
};
