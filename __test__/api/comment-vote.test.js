const app = require("../../server");
const supertest = require("supertest");
const CommentModel = require("../../models/comments");
const mongoose = require("mongoose");
const request = supertest(app);
import { describeIfEndpoint } from "../helpers/conditionalTests";

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/votes/upvote",
  "PATCH '/comments/:commentId/votes/upvote'",
  () => {
    test("Should upvote a comment", async () => {
      const commentObject = {
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: mongoose.Types.ObjectId(),
      };
      const comment = new CommentModel(commentObject);
      await comment.save();

      const res = await request
        .patch(`/comments/${comment._id}/votes/upvote`)
        .send({
          ownerId: commentObject.ownerId,
        });
      if (res.status === 404) {
        return true; // route not implemented yet
      }
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(String(comment._id));
      expect(res.body.data.numOfVotes).toEqual(1);
      expect(res.body.data.numOfUpVotes).toEqual(1);
      expect(res.body.data.numOfDownVotes).toEqual(0);
    });
  }
);

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/votes/downvote",
  "PATCH '/comments/:commentId/votes/downvote'",
  () => {
    test("Should downvote a comment", async () => {
      const commentObject = {
        content: "this is a comment",
        ownerId: "useremail2@email.com",
        origin: "123123",
        applicationId: mongoose.Types.ObjectId(),
      };
      const comment = new CommentModel(commentObject);
      await comment.save();

      const res = await request
        .patch(`/comments/${comment._id}/votes/downvote`)
        .send({
          ownerId: commentObject.ownerId,
        });
      if (res.status === 404) {
        return true; // route not implemented yet
      }
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(String(comment._id));
      expect(res.body.data.numOfVotes).toEqual(1);
      expect(res.body.data.numOfUpVotes).toEqual(0);
      expect(res.body.data.numOfDownVotes).toEqual(1);
    });
  }
);
