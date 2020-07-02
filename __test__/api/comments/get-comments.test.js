const app = require("../../../server");
const supertest = require("supertest");
const CommentModel = require("../../../models/comments");
const request = supertest(app);
const { describeIfEndpoint } = require("../../helpers/conditionalTests");

describeIfEndpoint("GET", "/comments", "GET '/comments' ", () => {
  // missing test 401 authentication error

  // status 200 when no comments in db
  test("Should return empty array of comments", async () => {
    const res = await request
      .get("/comments")
      .set("Authorization", `bearer ${global.appToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.length).toBe(0);
  });

  // status 200 when one comment in db
  test("Should return 1 result of comments", async () => {
    const comment = new CommentModel({
      content: "this is a comment",
      ownerId: "useremail@email.com",
      applicationId: global.application._id,
    });
    await comment.save();

    const res = await request
      .get("/comments")
      .set("Authorization", `bearer ${global.appToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]._id).toEqual(comment._id);
    expect(res.body.data[0].applicationId).toEqual(comment.applicationId);
  });

  // status 200 when two comments in db
  test("Should return 1 result of comments", async () => {
    const comment1 = new CommentModel({
      content: "this is a comment",
      ownerId: "useremail@email.com",
      applicationId: global.application._id,
    });
    await comment1.save();

    const comment2 = new CommentModel({
      content: "this is a comment",
      ownerId: "useremail@email.com",
      applicationId: global.application._id,
    });
    await comment2.save();

    const res = await request
      .get("/comments")
      .set("Authorization", `bearer ${global.appToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0]._id).toEqual(comment1._id);
    expect(res.body.data[0].applicationId).toEqual(comment1.applicationId);
    expect(res.body.data[1]._id).toEqual(comment2._id);
    expect(res.body.data[1].applicationId).toEqual(comment2.applicationId);
  });
});
