const app = require("../../server");
const ReplyModel = require("../../models/replies");
const CommentModel = require("../../models/comments");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../helpers/conditionalTests");

describeIfEndpoint(
  "GET",
  "/v1/comments/:commentId/votes",
  "GET /v1/comments/:commentId/votes",
  () => {
    it("Return all votes for a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        refId: 2,
        applicationId: global.application._id,
      });
      await comment.save();

      const res = await request
        .get(`/v1/comments/${comment._id}/votes`)
        .set("Authorization", `bearer ${global.appToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBeTruthy();
      expect(res.body.status).toBeTruthy();
      expect(res.body.data.commentId).toBeTruthy();
    });
  }
);
describeIfEndpoint(
  "GET",
  "/v1/comments/:commentId/replies/:replyId",
  "GET '/v1/comments/:commentId/replies/:replyId'",
  () => {
    test("Should return a reply to a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: global.application._id,
      });
      await comment.save();
      const commentId = comment._id;
      const reply = new ReplyModel({
        content: "this is a reply to a comment",
        ownerId: "replyinguseremail@email.com",
        commentId: commentId,
      });
      await reply.save();
      const replyId = reply._id;
      const res = await request
        .get(`/v1/comments/${commentId}/replies/${replyId}`)
        .set("Authorization", `bearer ${global.appToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.replyId).toEqual(String(replyId));
      expect(res.body.data.commentId).toEqual(String(comment._id));
      expect(res.body.data.ownerId).toEqual(String(reply.ownerId));
      expect(res.body.data.content).toEqual(String(reply.content));
      expect(res.body.data.numOfVotes).toEqual(0);
      expect(res.body.data.numOfUpVotes).toEqual(0);
      expect(res.body.data.numOfDownVotes).toEqual(0);
      expect(res.body.data.numOfFlags).toEqual(0);
    });
  }
);
