const app = require("../../server");
const CommentModel = require("../../models/comments");
const ReplyModel = require("../../models/replies");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../helpers/conditionalTests");

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/replies/:replyId/flag",
  "PATCH /comments/:commentId/replies/:replyId/flag",
  () => {
    // missing test 401 authentication error
    // missing test 404 not found error

    it("Flags a reply to a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();

      const reply = new ReplyModel({
        content: "this is a reply to a comment",
        commentId: comment._id,
        ownerId: "useremail@email.com",
      });
      await reply.save();

      comment.replies.push(reply);
      await comment.save();

      const flaggerId = "offendeduser@email.com";
      const res = await request
        .patch(`/comments/${comment._id}/replies/${reply._id}/flag`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: flaggerId,
        });

      expect(res.status).toBe(200);
      expect(res.body.data[0].commentId).toEqual(comment._id);
      expect(res.body.data[0].numOfFlags.length).toBe(1);
      expect(res.body.data[0].numOfFlags[0]).toEqual(flaggerId);
    });
  }
);
