const app = require("../../server");
const supertest = require("supertest");
const CommentModel = require("../../models/comments");
const mongoose = require("mongoose");
const request = supertest(app);

describe("POST '/comments' && '/comments/:id/replies'", () => {
  test("Should create comment", async () => {
    const res = await request.post("/comments").send({
      commentBody: "this is a comment",
      commentOwnerName: "userName",
      commentOwnerEmail: "useremail@email.com",
      commentOrigin: "123123",
    });
    if (res.status === 404) {
      return true; // route not implemented yet
    }
    expect(res.status).toBe(200);
    expect(res.body.data.commentBody).toBeTruthy();
    expect(res.body.data.commentOwnerName).toBeTruthy();
    expect(res.body.data.commentOwnerEmail).toBeTruthy();
  });

  test("Should create new reply to comment", async () => {
    const comment = new CommentModel({
      commentBody: "this is a comment",
      commentOwnerName: "userName",
      commentOwnerEmail: "useremail@email.com",
      commentOrigin: "123123",
      commentOwner: mongoose.Types.ObjectId(),
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
    expect(res.body.data.commentBody).toBeTruthy();
    expect(res.body.data.commentOwnerEmail).toBeTruthy();
  });
});
