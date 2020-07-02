const app = require("../../server");
const CommentModel = require("../../models/comments");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../helpers/conditionalTests");

describeIfEndpoint(
  "PATCH",
  "/comments/:commentId/flag",
  "PATCH /comments/:commentId/flag",
  () => {
    // missing test for empty body or no ownerId
    // missing test 401 authentication error
    // missing test 404 not found error
    it("Flags a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();

      const flaggerId = "offendeduser@email.com";
      const res = await request
        .patch(`/comments/${comment._id}/flag`)
        .set("Authorization", `bearer ${global.appToken}`)
        .send({
          ownerId: flaggerId,
        });

      expect(res.status).toBe(200);
      expect(res.body.data[0].commentId).toBeTruthy();
      expect(res.body.data[0].numOfFlags.length).toBe(1);
      expect(res.body.data[0].numOfFlags[0]).toEqual(flaggerId);
    });
  }
);
