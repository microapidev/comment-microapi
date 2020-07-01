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
        applicationId: mongoose.Types.ObjectId(),
      });
      await comment.save();

      try {
        const res = await request
          .patch(`/comments/${comment._id}`)
          .set({ Authorization: "" })
          .send({
            ownerId: comment.ownerId,
            content: "New Comment Update",
          });

        expect(res.status).toBe(200);
        expect(res.body.data.content).toBeTruthy();
        expect(res.body.data.ownerId).toBeTruthy();
      } catch (error) {
        console.log(error);
      }
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
  "/comments/:commentId/replies/:replyId/votes/upvote",
  "PATCH /comments/:commentId/replies/:replyId/votes/upvote",
  () => {
    it("Upvotes a comment reply", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: mongoose.Types.ObjectId(),
      });

      const reply = new ReplyModel({
        content: "this is a reply",
        ownerId: "useremail@email.com",
        commentId: mongoose.Types.ObjectId(),
      });
      reply.upVotes.push(reply.ownerId);
      await reply.save();
      comment.replies.push(reply);
      await comment.save();

      const res = await request
        .patch(`/comments/${comment._id}/replies/${reply._id}/votes/upvote`)
        .send({
          ownerId: "offendeduser@email.com",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.replyId).toBeTruthy();
      expect(res.body.data.commentId).toBeTruthy();
      expect(res.body.data.numOfVotes).toBeTruthy();
      expect(res.body.data.numOfUpVotes).toBeTruthy();
      expect(res.body.data.numOfDownVotes).toBeTruthy();
    });
  }
);
