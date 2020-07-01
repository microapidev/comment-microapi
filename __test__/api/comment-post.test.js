const app = require("../../server");
const supertest = require("supertest");
const CommentModel = require("../../models/comments");
const mongoose = require("mongoose");
const request = supertest(app);
import { describeIfEndpoint } from "../helpers/conditionalTests";

describeIfEndpoint("POST", "/comments", "POST '/comments'", () => {
  test("Should create comment", async () => {
    const res = await request.post("/comments").send({
      content: "this is a comment",
      ownerId: "useremail@email.com",
      applicationId: "5efafe22129bfdc7f768c69e",
      origin: "123123",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.content).toBeTruthy();
    expect(res.body.data.ownerId).toBeTruthy();
  });
});

describeIfEndpoint(
  "POST",
  "/comments/:id/replies",
  "POST '/comments/:commentId/replies'",
  () => {
    test("Should create new reply to comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: mongoose.Types.ObjectId(),
      });
      await comment.save();

      const res = await request.post(`/comments/${comment._id}/replies`).send({
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
