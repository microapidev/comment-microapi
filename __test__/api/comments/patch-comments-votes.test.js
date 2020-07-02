const app = require("../../../server");
const supertest = require("supertest");
const CommentModel = require("../../../models/comments");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/votes/upvotes",
  "PATCH '/comments/:commentId/votes/upvotes'",
  () => {
    // missing test to upvote already upvoted comment
    // missing test to upvote already downvoted comment
    // missing test 401 authentication error
    // missing test 402 validation error
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
        .patch(`/comments/${comment._id}/votes/upvote`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: commentObject.ownerId,
        });
      expect(res.status).toBe(200);
      expect(res.body.data[0].commentId).toEqual(String(comment._id));
      expect(res.body.data[0].numOfVotes).toBe(1);
      expect(res.body.data[0].numOfUpVotes).toBe(1);
      expect(res.body.data[0].numOfDownVotes).toBe(0);
    });
  }
);

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/votes/downvotes",
  "PATCH '/comments/:commentId/votes/downvotes'",
  () => {
    // missing test to downvote already upvoted comment
    // missing test to downvote already downvoted comment
    // missing test 401 authentication error
    // missing test 402 validation error
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
        .patch(`/comments/${comment._id}/votes/downvote`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: commentObject.ownerId,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(String(comment._id));
      expect(res.body.data.numOfVotes).toBe(1);
      expect(res.body.data.numOfUpVotes).toBe(0);
      expect(res.body.data.numOfDownVotes).toBe(1);
    });
  }
);
