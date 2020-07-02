const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const ReplyModel = require("../../../models/replies");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint(
  "GET",
  "/comments/:commentId/replies/:replyId/votes",
  "GET '/comments/:commentId/replies/:replyId/votes'",
  () => {
    // missing test 200 for upvote counts
    // missing test 200 for downvote counts
    // missing test 200 for upvote and downvote counts
    // missing test 401 authentication error
    // missing test 404 not found error

    // status 200 for empty votes array - no votes
    test("Get all votes of a comment's reply", async () => {
      const comment = new CommentModel({
        content: "This is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: global.application._id,
      });
      await comment.save();

      const reply = new ReplyModel({
        content: "This is a reply to a comment",
        commentId: comment._id,
        ownerId: "useremail@email.com",
      });
      await reply.save();

      comment.replies.push(reply);
      await comment.save();

      const res = await request
        .get(`/comments/${comment._id}/replies/${reply._id}/votes`)
        .set("Authorization", `bearer ${global.appToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].replyId).toEqual(String(reply._id));
      expect(res.body.data[0].commentId).toEqual(String(comment._id));
      expect(res.body.data[0].votes.length).toBe(0);
    });
  }
);
