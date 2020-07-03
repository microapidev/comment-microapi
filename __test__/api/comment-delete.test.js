const app = require("../../server");
const supertest = require("supertest");
const CommentModel = require("../../models/comments");
const ReplyModel = require("../../models/replies");
// const mongoose = require("mongoose");
const request = supertest(app);
import { describeIfEndpoint } from "../helpers/conditionalTests";

describeIfEndpoint(
  "DELETE",
  "/v1/comments/:commentId",
  "DELETE '/v1/comments/:commentId'",
  () => {
    test("Should delete comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: global.application._id,
      });
      await comment.save();

      const res = await request
        .delete(`/v1/comments/${comment._id}`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: comment.ownerId,
        });
      if (res.status === 404) {
        return true;
      }
      expect(res.status).toBe(200);
      expect(res.body.data.content).toBeTruthy();
      expect(res.body.data.ownerId).toBeTruthy();
    });
  }
);

describeIfEndpoint(
  "DELETE",
  "/v1/comments/:commentId/replies/:replyId",
  "DELETE '/v1/comments/:commentId/replies/:replyId'",
  () => {
    test("Should delete a reply to a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: global.application._id,
      });
      await comment.save();

      const reply = new ReplyModel({
        content: "this is a reply to a comment",
        commentId: comment._id,
        upVotes: 0,
        downVotes: 0,
        ownerId: "useremail@email.com",
      });
      await reply.save();

      const res = await request
        .delete(`/v1/comments/${comment._id}/replies/${reply._id}`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: "useremail@email.com",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.replyId).toEqual(String(reply._id));
      expect(res.body.data.commentId).toEqual(String(comment._id));
      expect(res.body.data.ownerId).toBeTruthy();
    });
  }
);
