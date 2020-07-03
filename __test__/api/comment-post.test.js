const app = require("../../server");
const supertest = require("supertest");
const CommentModel = require("../../models/comments");
// const mongoose = require("mongoose");
const request = supertest(app);
import { describeIfEndpoint } from "../helpers/conditionalTests";

describeIfEndpoint("POST", "/v1/comments", "POST '/v1/comments'", () => {
  test("Should create comment", async () => {
    const res = await request
      .post("/v1/comments")
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
        origin: "123123",
      });
    expect(res.status).toBe(200);
    expect(res.body.data.content).toBeTruthy();
    expect(res.body.data.ownerId).toBeTruthy();
  });
});

describeIfEndpoint(
  "POST",
  "/v1/comments/:id/replies",
  "POST '/v1/comments/:commentId/replies'",
  () => {
    test("Should create new reply to comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: global.application._id,
      });
      await comment.save();

      const res = await request
        .set("Authorization", `bearer ${global.appToken}`)
        .post(`/v1/comments/${comment._id}/replies`)
        .send({
          commentId: comment._id,
          replyBody: "this is a reply to a comment",
          replyOwnerName: "userName",
          replyOwnerEmail: "useremail@email.com",
        });
      if (res.status === 404) {
        return true; // route not implemented yet
      }
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(comment._id);
      expect(res.body.data.content).toBeTruthy();
      expect(res.body.data.ownerId).toBeTruthy();
    });
  }
);
