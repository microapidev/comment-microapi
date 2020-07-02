
   // PATCH upvote a reply
const upVoteReply = async (req, res, next) => {
  const commentId = req.params.commentId;
  const replyId = req.params.replyId;
  const voterId = req.body.voterId;

  try {
    let comment = await Comments.findById(commentId);
    if (!comment) {
      return next(new CustomError(404, "Comment not found"));
    }
    let reply = await Replies.findById(replyId);
    if (!reply) {
      return next(new CustomError(404, "Reply not found"));
    }
    if (reply.upVotes.includes(voterId)) {
      return next(new CustomError(409, "You've already updated this reply"));
    }
    if (reply.downVotes.includes(voterId)) {
      return next(
        new CustomError(409, "It seems you've already downvoted this reply.")
      );
    }
    await reply.updateOne({
      _id: replyId,
      $push: { upVotes: voterId },
    });
    const data = {
      commentId: commentId,
      replyId: replyId,
      numOfVotes: reply.downVotes.length + reply.upVotes.length + 1,
      numOfUpvotes: reply.upVotes.length + 1,
      numOfDownvotes: reply.downVotes.length,
    }
    return responseHandler(
      res,
      200,
      data,
      "Reply upvoted!"
    );
  } catch (error) {
    return next(new CustomError(500, "Something went wrong, try again"));
  }
}     
  
      

