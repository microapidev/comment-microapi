const app = require("../../server");
const CommentModel = require("../../models/comments");
// const ReplyModel = require("../../models/replies");
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

      const res = await request.patch(`/comments/${comment._id}`).send({
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
