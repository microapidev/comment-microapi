const app = require("../../../server");
const supertest = require("supertest");
const CommentModel = require("../../../models/comments");
const mongoose = require("mongoose");
const ReplyModel = require("../../../models/replies");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint(
  "DELETE",
  "/comments/:commentId/replies/:replyId",
  "DELETE '/comments/:commentId/replies/:replyId'",
  () => {
    // missing test 401 authentication error
    // missing test 402 validation error

    // status 200
    test.skip("Should delete a reply to a comment", async () => {
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
        .delete(`/comments/${comment._id}/replies/${reply._id}`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: "useremail@email.com",
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].replyId).toEqual(String(reply._id));
      expect(res.body.data[0].commentId).toEqual(String(comment._id));
      expect(res.body.data[0].ownerId).toEqual(reply.ownerId);
      expect(res.body.data[0].content).toEqual(String(reply.comment));
      expect(res.body.data[0].numOfVotes).toBe(0);
      expect(res.body.data[0].numOfUpVotes).toBe(0);
      expect(res.body.data[0].numOfDownVotes).toBe(0);
      expect(res.body.data[0].numOfFlags).toBe(0);
    });

    // 404 not found error
    test.skip("Should fail to delete reply not found", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();

      const rogue = {
        _id: mongoose.Types.ObjectId(),
        ownerId: "rogueuser@email.com",
      };

      const res = await request
        .delete(`/comments/${comment._id}/replies/${rogue._id}`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: rogue.ownerId,
        });

      expect(res.status).toBe(404);
      expect(res.body.status).toEqual("error");
      expect(res.body.data.length).toBe(0);
    });
  }
);
