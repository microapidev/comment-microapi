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
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].commentId).toBeTruthy();
    expect(res.body.data[0].refId).toEqual("4edd40c86762e0fb12000003");
    expect(res.body.data[0].applicationId).toEqual(global.application._id);
    expect(res.body.data[0].content).toEqual("this is a comment");
    expect(res.body.data[0].ownerId).toEqual("useremail@email.com");
    expect(res.body.data[0].numOfVotes).toBe(0);
    expect(res.body.data[0].numOfUpVotes).toBe(0);
    expect(res.body.data[0].numOfDownVotes).toBe(0);
    expect(res.body.data[0].numOfFlags).toBe(0);
    expect(res.body.data[0].numOfReplies).toBe(0);
  });
});
