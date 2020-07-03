const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId",
  "PATCH /comments/:commentId",
  () => {
    // missing test 401 authentication error
    // missing test 404 not found error
    test.skip("Updates a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();

      const newContent = "New Comment Update";
      const res = await request
        .patch(`/comments/${comment._id}`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: comment.ownerId,
          content: newContent,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].content).toEqual(newContent);
      expect(res.body.data[0].ownerId).toEqual(comment.ownerId);
    });
  }
);
