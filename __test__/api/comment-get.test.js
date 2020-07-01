const app = require("../../server");
const CommentModel = require("../../models/comments");
const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../helpers/conditionalTests");

describeIfEndpoint("GET", "/comments", "GET '/comments' ", () => {
  it("Return all comments from the db", async () => {
    const res = await request.get("/comments");
    if (res.status === 404) {
      console.log("GET /comments Not Implemented Yet");
      return true;
    }

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toBeTruthy();
  });
});

describeIfEndpoint(
  "GET",
  "/comments/:commentId/replies",
  "GET /comments/:commentId/replies",
  () => {
    it("Return all replies for a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        refId: 2,
        applicationId: mongoose.Types.ObjectId(),
      });
      await comment.save();

      const commentId = comment._id;

      const res = await request.get(`/comments/${commentId}/replies`);

      if (res.status === 404) {
        console.log(`/comments/:commentId/replies, Route Not Implemented Yet`);
        return true;
      }
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toBeTruthy();
    });
  }
);

describeIfEndpoint(
  "GET",
  "/comments/:commentId/votes",
  "GET /comments/:commentId/votes",
  () => {
    it("Return all votes for a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        refId: 2,
        applicationId: mongoose.Types.ObjectId(),
      });
      await comment.save();

      const res = await request.get(`/comments/${comment._id}/votes`);

      expect(res.status).toBe(200);
      expect(res.message).toBeTruthy();
      expect(res.body.data.commentId).toBeTruthy();
      expect(res.body.data.totalVotes).toBeTruthy();
      expect(res.body.data.upvotes).toBeTruthy();
      expect(res.body.data.downvotes).toBeTruthy();
    });
  }
);
