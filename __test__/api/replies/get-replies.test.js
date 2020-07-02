const app = require("../../server");
const ReplyModel = require("../../models/replies");
const CommentModel = require("../../models/comments");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../helpers/conditionalTests");

describeIfEndpoint(
  "GET",
  "/comments/:commentId/replies",
  "GET /comments/:commentId/replies",
  () => {
    // missing test 401 authentication error
    // missing test 404 not found error
    test("Should return empty reply for a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();

      const res = await request
        .get(`/comments/${comment.commentId}/replies`)
        .set("Authorization", `bearer ${global.appToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.length).toBe(0);
    });

    test("Should return all (1) reply for a comment", async () => {
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

      const res = await request
        .get(`/comments/${comment.commentId}/replies`)
        .set("Authorization", `bearer ${global.appToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0]._id).toEqual(reply._id);
      expect(res.body.data[0].commentId).toEqual(reply.commentId);
    });

    test("Should return all (2) replies for a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();

      const reply1 = new ReplyModel({
        content: "this is reply one to a comment",
        commentId: comment._id,
        ownerId: "useroneemail@email.com",
      });
      await reply1.save();

      const reply2 = new ReplyModel({
        content: "this is reply two to a comment",
        commentId: comment._id,
        ownerId: "usertwoemail@email.com",
      });
      await reply2.save();

      comment.replies.push(reply1, reply2);
      await comment.save();

      const res = await request
        .get(`/comments/${comment.commentId}/replies`)
        .set("Authorization", `bearer ${global.appToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0]._id).toEqual(reply1._id);
      expect(res.body.data[0].commentId).toEqual(reply1.commentId);
      expect(res.body.data[1]._id).toEqual(reply2._id);
      expect(res.body.data[1].commentId).toEqual(reply2.commentId);
    });
  }
);
