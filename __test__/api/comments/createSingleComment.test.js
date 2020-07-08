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
    comment = {
      refId: "4edd40c86762e0fb12000003",
      applicationId: global.application._id,
      ownerId: "useremail@email.com",
      content: "this is a comment",
      origin: "useremail@email.com",
    };
    const res = await request
      .post("/v1/comments")
      .set("Authorization", `bearer ${global.appToken}`)
      .send(comment);
    let [expected] = await CommentModel.find({
      refId: "4edd40c86762e0fb12000003",
    });
    comment = {
      commentId: expected.id,
      refId: expected.refId,
      ownerId: expected.ownerId,
      content: expected.content,
      origin: expected.origin,
      numOfReplies: expected.replies.length,
      numOfVotes: expected.upVotes.length + expected.downVotes.length,
      numOfUpVotes: expected.upVotes.length,
      numOfDownVotes: expected.downVotes.length,
      numOfFlags: expected.flags.length,
    };
    expect(res.status).toBe(201);
    expect(res.body.status).toEqual("success");
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

  test("Should return 401 error for 'Unauthorized' token", async () => {
    const res = await request.post("/v1/comments");
    comment = res.body;
    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
    //expect(res.body.message).toBeTruthy(); // or {}
  });
});
