const app = require("../../../server");
const ReplyModel = require("../../../models/replies");
const CommentModel = require("../../../models/comments");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint(
  "GET",
  "/comments/:commentId/replies/:replyId",
  "GET '/comments/:commentId/replies/:replyId'",
  () => {
    // missing test 401 authentication error
    test("Should return a reply to a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();
      const commentId = comment._id;
      const reply = new ReplyModel({
        content: "this is a reply to a comment",
        ownerId: "replyinguseremail@email.com",
        commentId: commentId,
      });
      await reply.save();

      comment.replies.push(reply);
      await comment.save();

      const replyId = reply._id;
      const res = await request
        .get(`/comments/${commentId}/replies/${replyId}`)
        .set("Authorization", `bearer ${global.appToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0]._id).toEqual(String(replyId));
      expect(res.body.data[0].commentId).toEqual(String(comment._id));
      expect(res.body.data[0].content).toEqual(String(reply.content));
      expect(res.body.data[0].ownerId).toEqual(String(reply.ownerId));
    });

    test("Should return empty array when no replies to a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();
      const commentId = comment._id;
      const replyId = comment._id;
      const res = await request
        .get(`/comments/${commentId}/replies/${replyId}`)
        .set("Authorization", `bearer ${global.appToken}`);

      expect(res.status).toBe(404);
      expect(res.body.data.length).toBe(0);
      expect(res.body.status).toEqual("error");
    });
  }
);
