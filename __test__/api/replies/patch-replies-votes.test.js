const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const ReplyModel = require("../../../models/replies");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

// missing test PATCH /comments/:commentId/replies/:replyId/votes/upvote

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/replies/:replyId/votes/downvote",
  "PATCH /comments/:commentId/replies/:replyId/votes/downvote",
  () => {
    // missing test to downvote when no votes
    // missing test to downvote when already upvoted
    // missing test 401 authentication error
    // missing test 404 not found error

    // downvote when already downvoted
    it("should downvote a reply to a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();

      const reply = new ReplyModel({
        content: "this is a reply",
        commentId: global.application._id,
        ownerId: "useremail@email.com",
      });
      reply.downVotes.push(reply.ownerId);
      await reply.save();

      comment.replies.push(reply);
      await comment.save();

      const res = await request()
        .patch(`/comments/${comment._id}/replies/${reply._id}/votes/downvote`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: "offendeduser@gmail.com",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].commentId).toEqual(comment._id);
      expect(res.body.data[0].replyId).toEqualy(reply._id);
      expect(res.body.data[0].numOfVotes).toBe(0);
      expect(res.body.data[0].numOfUpVotes).toBe(0);
      expect(res.body.data[0].numOfDownVotes).toBe(0);
    });
  }
);
