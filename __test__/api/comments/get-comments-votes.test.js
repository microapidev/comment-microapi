const app = require("../../server");
const CommentModel = require("../../models/comments");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../helpers/conditionalTests");

describeIfEndpoint(
  "GET",
  "/comments/:commentId/votes",
  "GET /comments/:commentId/votes",
  () => {
    // missing test 400 bad request

    // missing test 401 authentication error

    // missing test 402 validation error

    // missing test 404 not found error

    // status 200
    it("Return all votes for a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();

      const res = await request
        .get(`/comments/${comment._id}/votes`)
        .set("Authorization", `bearer ${global.appToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBeTruthy();
      expect(res.body.status).toBeTruthy();
      expect(res.body.data.commentId).toBeTruthy();
      expect(res.body.data.votes).toBeTruthy();
    });
  }
);
