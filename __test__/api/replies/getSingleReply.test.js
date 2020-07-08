const app = require("../../../server");
const ReplyModel = require("../../../models/replies");
const CommentModel = require("../../../models/comments");
const replyHandler = require("../../../utils/replyHandler");
const supertest = require("supertest");
// const { invalid } = require("@hapi/joi");
const request = supertest(app);

let comment;
let reply1, reply2;
let savedReply1, savedReply2;

describe("GET /comments/:commentId/replies/:replyId", () => {
  beforeEach(async () => {
    // Mock a comment document
    const mockedCommentDoc = new CommentModel({
      content: "A comment from user 1",
      ownerId: "user1@email.com",
      origin: "123123",
      refId: 2,
      applicationId: global.application._id,
    });

    // Mock a reply document.
    const mockedReply1Doc = new ReplyModel({
      content: "A reply from user 2",
      ownerId: "user2@email.com",
      commentId: mockedCommentDoc.id,
    });

    // Mock a reply document.
    const mockedReply2Doc = new ReplyModel({
      content: "A reply from user 3",
      ownerId: "user3@email.com",
      commentId: mockedCommentDoc.id,
      flags: [mockedCommentDoc.ownerId],
    });

    // Save mocked comment document to the database and cache.
    comment = await mockedCommentDoc.save();

    // Save mocked replies document to the database.
    savedReply1 = await mockedReply1Doc.save();
    savedReply2 = await mockedReply2Doc.save();

    // Add replies to the mocked comment.
    await CommentModel.findByIdAndUpdate(comment.id, {
      $push: {
        replies: { $each: [savedReply1.id, savedReply2.id] },
      },
    });

    // Cache response objects
    reply1 = replyHandler(savedReply1);
    reply2 = replyHandler(savedReply2);
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(comment.id);
    await ReplyModel.findByIdAndDelete(reply1.replyId);
    await ReplyModel.findByIdAndDelete(reply2.replyId);

    // Delete cache.
    comment = null;
    reply1 = null;
    reply2 = null;
  });

  it("should get a single reply of a comment", async () => {
    const url = `/v1/comments/${comment.id}/replies/${savedReply1.id}`;
    const bearerToken = `bearer ${global.appToken}`;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toMatchObject(reply1);
  });

  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/comments/${comment.id}/replies/${savedReply1.id}`;
    const bearerToken = `bearer `;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("should return 400 for invalid commentId", async () => {
    const commentId = "1234dgfis203Aafhfd";
    const url = `/v1/comments/${commentId}/replies/${savedReply1.id}`;
    const bearerToken = `bearer ${global.appToken}`;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("should return 400 for invalid replyId", async () => {
    const replyId = "1234dgfis203Aafhfd";
    const url = `/v1/comments/${comment.id}/replies/${replyId}`;
    const bearerToken = `bearer ${global.appToken}`;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("Should return a 404 error when commentId or replyId is not an existing ID", async () => {
    const invalidCommentUrl = `/v1/comments/5eff06f9fa2a9a0017469f54/replies/${savedReply1.id}`;
    const invalidReplyUrl = `/v1/comments/${comment.id}/replies/5eff06f9fa2a9a0017469f54`;
    const bearerToken = `bearer ${global.appToken}`;

    const res1 = await request
      .get(invalidCommentUrl)
      .set("Authorization", bearerToken);

    expect(res1.status).toEqual(404);
    expect(res1.body.status).toEqual("error");
    expect(res1.body.data).toEqual([]);

    const res2 = await request
      .get(invalidReplyUrl)
      .set("Authorization", bearerToken);

    expect(res2.status).toEqual(404);
    expect(res2.body.status).toEqual("error");
    expect(res2.body.data).toEqual([]);
  });
});
