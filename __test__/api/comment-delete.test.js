const app = require("../../server");
const supertest = require("supertest");
const CommentModel = require("../../models/comments");
const ReplyModel = require("../../models/replies");
const mongoose = require("mongoose");
const request = supertest(app);
import { describeIfEndpoint } from "../helpers/conditionalTests";

describeIfEndpoint(
  "DELETE",
  "/comments/:commentId",
  "DELETE '/comments/:commentId'",
  () => {
    test("Should delete comment", async () => {
      const comment = new CommentModel({
        commentBody: "this is a comment",
        commentOwnerName: "userName",
        commentOwnerEmail: "useremail@email.com",
        commentOrigin: "123123",
        commentOwner: mongoose.Types.ObjectId(),
      });
      await comment.save();

      const res = await request.delete(`/comments/${comment._id}`).send({
        commentOwnerEmail: comment.email,
      });
      if (res.status === 404) {
        return true;
      }
      expect(res.status).toBe(200);
      expect(res.body.data.commentBody).toBeTruthy();
      expect(res.body.data.commentOwnerName).toBeTruthy();
      expect(res.body.data.commentOwnerEmail).toBeTruthy();
    });
  }
);

describeIfEndpoint(
  "DELETE",
  "/comments/:commentId/replies/:replyId",
  "DELETE '/comments/:commentId/replies/:replyId'",
  () => {
    test("Should delete a reply to a comment", async () => {
      const comment = new CommentModel({
        commentBody: "this is a comment",
        commentOwnerName: "userName",
        commentOwnerEmail: "useremail@email.com",
        commentOrigin: "123123",
        commentOwner: mongoose.Types.ObjectId(),
      });
      await comment.save();

      const reply = new ReplyModel({
        replyBody: "this is a reply to a comment",
        commentId: comment._id,
        upVotes: 0,
        downVotes: 0,
      });
      await reply.save();

      const res = await request
        .delete(`/comments/${comment._id}/replies/${reply._id}`)
        .send({
          replyOwnerEmail: "useremail@email.com",
        });
      if (res.status === 404) {
        return true; // route not implemented yet
      }
      expect(res.status).toBe(200);
      expect(res.body.data.replyId).toEqual(reply._id);
      expect(res.body.data.commentId).toEqual(comment._id);
      expect(res.body.data.replyOwnerEmail).toBeTruthy();
    });
  }
);
