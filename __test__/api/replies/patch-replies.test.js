const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const ReplyModel = require("../../../models/replies");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/replies/:replyId",
  "PATCH /comments/:commentId/replies/:replyId",
  () => {
    it("should update a reply to a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();

      const reply = new ReplyModel({
        content: "this is a reply",
        commentId: global.application._id,
        ownerId: "useremail@email.com",
      });
      await reply.save();

      comment.replies.push(reply);
      await comment.save();

      const newContent = "Updated Reply";
      const res = await request
        .patch(`/comments/${comment._id}/replies/${reply._id}`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: reply.ownerId,
          content: newContent,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].ownerId).toEqual(reply.ownerId);
      expect(res.body.data[0].content).toEqual(newContent);
    });
  }
);
