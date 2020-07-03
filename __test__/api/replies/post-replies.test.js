const app = require("../../../server");
const supertest = require("supertest");
const CommentModel = require("../../../models/comments");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint(
  "POST",
  "/comments/:id/replies",
  "POST '/comments/:commentId/replies'",
  () => {
    // missing test 401 authentication error
    // missing test 404 not found error
    // missing test to POST with missing required parameters
    // missing test to POST with empty body
    test.skip("Should create new reply to comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
        applicationId: global.application._id,
      });
      await comment.save();

      const res = await request
        .set("Authorization", `bearer ${global.appToken}`)
        .post(`/comments/${comment._id}/replies`)
        .send({
          content: "this is a reply to a comment",
          ownerId: "useremail@email.com",
        });

      expect(res.status).toBe(201);
      expect(res.body.data[0].commentId).toEqual(comment._id);
      expect(res.body.data[0].content).toEqual("this is a reply to a comment");
      expect(res.body.data[0].ownerId).toEqual("useremail@email.com");
    });
  }
);
