const app = require("../../server");
const CommentModel = require("../../models/comments");
const ReplyModel = require("../../models/replies");
const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../helpers/conditionalTests");

describeIfEndpoint(
  "GET",
  "/comments/:commentId/replies/:replyId/votes",
  "GET '/comments/:commentId/replies/:replyId/votes'",
  () => {
    test("Get all votes of a comment's reply", async () => {
      const comment = new CommentModel({
        content: "This is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: mongoose.Types.ObjectId(),
      });
      await comment.save();

      const reply = new ReplyModel({
        content: "This is a reply to a comment",
        commentId: comment._id,
        upVotes: 0,
        downVotes: 0,
        ownerId: "useremail@email.com",
      });
      await reply.save();

      const replyId = reply._id;
      const commentId = comment._id;

      const res = await request
        .get(`/comments/${commentId}/replies/${replyId}/votes`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          replyId,
          commentId,
        });

      if (res.status === 404) {
        console.log(
          `/comments/:commentId/replies/:replyId/votes, Route not implemented`
        );
        return true;
      }
      expect(res.status).toBe(200);
      expect(res.body.data.votes).toBeTruthy();
      expect(res.body.data.commentId).toBeTruthy();
      expect(res.body.data.replyId).toBeTruthy();
    });
  }
);
