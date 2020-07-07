const app = require("../../../server");
const supertest = require("supertest");
const CommentModel = require("../../../models/comments");
const request = supertest(app);

describe("POST /comments", () => {
  let comment;

  afterEach(async () => {
    await CommentModel.findByIdAndDelete(comment.commentId);
    comment = null;
  });

  test("Should create comment", async () => {
    const res = await request
      .post("/v1/comments")
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        refId: "4edd40c86762e0fb12000003",
        applicationId: global.application._id,
        ownerId: "useremail@email.com",
        content: "this is a comment",
        origin: "useremail@email.com",
      });
    comment = res.body;
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

  test("Should return 422 error when 'content' parameter missing", async () => {
    const res = await request
      .post("/v1/comments")
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "useremail@email.com",
      });
    comment = res.body;
    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
    //expect(res.body.message).toBeTruthy(); // or {}
  });

  test("Should return 422 error when 'ownerId' parameter missing", async () => {
    const res = await request
      .post("/v1/comments")
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        content: "this is a comment",
      });
    comment = res.body;
    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
    //expect(res.body.message).toBeTruthy(); // or {}
  });

  test("Should return 401 error when 'Authorization' token missing", async () => {
    const res = await request.post("/v1/comments");
    comment = res.body;
    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
    //expect(res.body.message).toBeTruthy(); // or {}
  });
});
