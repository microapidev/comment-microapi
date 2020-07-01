const app = require("../../server");
const CommentModel = require("../../models/comments");
const ReplyModel = require("../../models/replies");
const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../helpers/conditionalTests");

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId",
  "PATCH /comments/:commentId",
  () => {
    it("Updates a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: global.application._id,
      });
      await comment.save();

      const res = await request
        .patch(`/comments/${comment._id}`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: comment.ownerId,
          content: "New Comment Update",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.content).toBeTruthy();
      expect(res.body.data.ownerId).toBeTruthy();
    });
  }
);

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/flag",
  "PATCH /comments/:commentId/flag",
  () => {
    it("Flags a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: mongoose.Types.ObjectId(),
      });
      await comment.save();

      const res = await request.patch(`/comments/${comment._id}/flag`).send({
        ownerId: "offendeduser@email.com",
      });

      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toBeTruthy();
      expect(res.body.data.numOfFlags).toBeTruthy();
    });
  }
);

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/replies/:replyId/flag",
  "PATCH /comments/:commentId/replies/:replyId/flag",
  () => {
    it("Flags a reply to a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: mongoose.Types.ObjectId(),
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
        .patch(`/comments/${comment._id}/replies/${reply._id}/flag`)
        .send({
          ownerId: "offendeduser@email.com",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toBeTruthy();
      expect(res.body.data.numOfFlags).toEqual(1);
    });
  }
);

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/replies/:replyId/downvote",
  "PATCH /comments/:commentId/replies/:replyId/downvote",
  () => {
    it("should downvote a reply to a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: mongoose.Types.ObjectId(),
      });
      await comment.save();

      const reply = new ReplyModel({
        content: "this is a reply to a comment",
        commentId: comment._id,
        upVotes: 0,
        flags: 0,
        ownerId: "useremail@email.com",
      });
      await reply.save();

      const res = await request()
        .patch(`/comments/${comment._id}/replies/${reply._id}/downvote`)
        .set("Authorization", ``)
        .send({
          ownerId: "joe@gmail.com",
        })
        .status(200);

      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toBeTruthy();
      expect(res.body.data.numOfDownvotes).toEqual(1);
    });
  }
);
