const app = require("../../../server");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint("POST", "/comments", "POST '/comments'", () => {
  // missing test 401 authentication error
  // missing test 404 not found error
  // missing test to POST with missing required parameters
  // missing test to POST with empty body
  test.skip("Should create comment", async () => {
    const res = await request
      .post("/comments")
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        refId: "4edd40c86762e0fb12000003",
        applicationId: global.application._id,
        ownerId: "useremail@email.com",
        content: "this is a comment",
        origin: "useremail@email.com",
      });
    expect(res.status).toBe(201);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.commentId).toBeTruthy();
    expect(res.body.data.refId).toEqual("4edd40c86762e0fb12000003");
    expect(res.body.data.content).toEqual("this is a comment");
    expect(res.body.data.ownerId).toEqual("useremail@email.com");
    expect(res.body.data.numOfVotes).toBe(0);
    expect(res.body.data.numOfUpVotes).toBe(0);
    expect(res.body.data.numOfDownVotes).toBe(0);
    expect(res.body.data.numOfFlags).toBe(0);
    expect(res.body.data.numOfReplies).toBe(0);
  });
});
