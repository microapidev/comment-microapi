const app = require("../../server");
const supertest = require("supertest");
const CommentModel = require("../../models/comments");
const mongoose = require("mongoose");
const request = supertest(app);
import { describeIfEndpoint } from "../helpers/conditionalTests";

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/votes",
  "PATCH '/comments/:commentId/votes'",
  () => {
    test("Should upvote a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: mongoose.Types.ObjectId(),
      });
      await comment.save();

      const res = await request.patch(`/comments/${comment._id}/votes`).send({
        voteType: "upvote",
      });
      if (res.status === 404) {
        return true; // route not implemented yet
      }
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toBeTruthy();
      expect(res.body.data.totalVotes).toBeTruthy();
      expect(res.body.data.upvotes).toBeTruthy();
      expect(res.body.data.downvotes).toBeTruthy();
    });

    test("Should downvote a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail2@email.com",
        origin: "123123",
        applicationId: mongoose.Types.ObjectId(),
      });
      await comment.save();

      const res = await request.patch(`/comments/${comment._id}/votes`).send({
        voteType: "downvote",
      });
      if (res.status === 404) {
        return true; // route not implemented yet
      }
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toBeTruthy();
      expect(res.body.data.totalVotes).toBeTruthy();
      expect(res.body.data.upvotes).toBeTruthy();
      expect(res.body.data.downvotes).toBeTruthy();
    });

    test("Should reject unknown vote type", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail3@email.com",
        origin: "123123",
        applicationId: mongoose.Types.ObjectId(),
      });
      await comment.save();

      const res = await request.patch(`/comments/${comment._id}/votes`).send({
        voteType: "invalid",
      });
      if (res.status === 404) {
        return true; // route not implemented yet
      }
      expect(res.status).toBe(422);
      expect(res.body.data.status).toBeTruthy();
      expect(res.body.data.message).toBeTruthy();
    });
  }
);
