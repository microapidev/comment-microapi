const app = require("../../server");
const supertest = require("supertest");
const CommentModel = require("../../models/comments");
// sconst mongoose = require("mongoose");
const request = supertest(app);
import { describeIfEndpoint } from "../helpers/conditionalTests";

describeIfEndpoint(
  "PATCH",
  "/v1/comments/:commentId/votes/upvotes",
  "PATCH '/v1/comments/:commentId/votes/upvotes'",
  () => {
    test("Should upvote a comment", async () => {
      const commentObject = {
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: global.application._id,
      };
      const comment = new CommentModel(commentObject);
      await comment.save();

      const res = await request
        .patch(`/v1/comments/${comment._id}/votes/upvote`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: commentObject.ownerId,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(String(comment._id));
      expect(res.body.data.numOfVotes).toBeTruthy();
      expect(res.body.data.numOfUpVotes).toBeTruthy();
      expect(res.body.data.numOfDownVotes).toBeTruthy();
    });
  }
);

describeIfEndpoint(
  "PATCH",
  "/v1/comments/:commentId/votes/downvotes",
  "PATCH '/v1/comments/:commentId/votes/downvotes'",
  () => {
    test("Should downvote a comment", async () => {
      const commentObject = {
        content: "this is a comment",
        ownerId: "useremail2@email.com",
        origin: "123123",
        applicationId: global.application._id,
      };
      const comment = new CommentModel(commentObject);
      await comment.save();

      const res = await request
        .patch(`/v1/comments/${comment._id}/votes/downvote`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: commentObject.ownerId,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(String(comment._id));
      expect(res.body.data.numOfVotes).toBeTruthy();
      expect(res.body.data.numOfUpVotes).toBeTruthy();
      expect(res.body.data.numOfDownVotes).toBeTruthy();
    });
  }
);
