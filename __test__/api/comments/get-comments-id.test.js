const app = require("../../server");
const supertest = require("supertest");
const CommentModel = require("../../models/comments");
const request = supertest(app);
const { describeIfEndpoint } = require("../helpers/conditionalTests");

describeIfEndpoint(
  "GET",
  "/comments/:commentId",
  "GET '/comments/:commentId' ",
  () => {
    // missing test 401 authentication error
    // missing test 404 not found error

    test("Should return result matching commentId", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();

      const res = await request
        .get(`/comments/${comment._id}`)
        .set("Authorization", `bearer ${global.appToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0]._id).toEqual(comment._id);
      expect(res.body.data[0].applicationId).toEqual(comment.applicationId);
    });
  }
);
