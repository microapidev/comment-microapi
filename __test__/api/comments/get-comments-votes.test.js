const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint(
  "GET",
  "/comments/:commentId/votes",
  "GET /comments/:commentId/votes",
  () => {
    // missing test 200 for upvote counts
    // missing test 200 for downvote counts
    // missing test 200 for upvote and downvote counts
    // missing test 401 authentication error
    // missing test 404 not found error

    // status 200 for empty votes array - no votes
    it("Return all votes for a comment", async () => {
      const comment = new CommentModel({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
      await comment.save();

      const res = await request
        .get(`/comments/${comment._id}/votes`)
        .set("Authorization", `bearer ${global.appToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].commentId).toEqual(comment._id);
      expect(res.body.data[0].upVotes.length).toBe(0);
      expect(res.body.data[0].downVotes.length).toBe(0);
    });
  }
);
