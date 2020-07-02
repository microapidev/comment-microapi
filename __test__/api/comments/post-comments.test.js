const app = require("../../../server");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint("POST", "/comments", "POST '/comments'", () => {
  // missing test 401 authentication error
  // missing test 404 not found error
  // missing test to POST with missing required parameters
  // missing test to POST with empty body
  test("Should create comment", async () => {
    const res = await request
      .post("/comments")
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        applicationId: global.application._id,
      });
    expect(res.status).toBe(201);
    expect(res.body.data[0].content).toEqual("this is a comment");
    expect(res.body.data[0].ownerId).toEqual("useremail@email.com");
  });
});
