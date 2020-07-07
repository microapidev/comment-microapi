const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const supertest = require("supertest");
const request = supertest(app);

let comment;

describe("GET /comments/:commentId", () => {
  beforeEach(async () => {
    // Mock a comment document
    const mockedCommentDoc = new CommentModel({
      content: "A comment from user 1",
      ownerId: "user1@email.com",
      origin: "123123",
      refId: 2,
      applicationId: global.application._id,
    });

    // Save mocked comment document to the database.
    const savedComment = await mockedCommentDoc.save();

    // Cache response object
    comment = {
      commentId: savedComment.id,
      refId: savedComment.refId,
      applicationId: savedComment.applicationId.toString(),
      ownerId: savedComment.ownerId,
      content: savedComment.content,
      origin: savedComment.origin,
      numOfReplies: savedComment.replies.length,
      numOfVotes: savedComment.upVotes.length + savedComment.downVotes.length,
      numOfUpVotes: savedComment.upVotes.length,
      numOfDownVotes: savedComment.downVotes.length,
      numOfFlags: savedComment.flags.length,
    };
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(comment.commentId);

    // Delete cache.
    comment = null;
  });

  it("should get single comment", async () => {
    const bearerToken = `bearer ${global.appToken}`;

    const res = await request
      .get(`/v1/comments/${comment.commentId}`)
      .set("Authorization", bearerToken);

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toMatchObject(comment);
  });

  it("should return error for Unauthorized token", async () => {
    const res = await request.get(`/v1/comments/${comment.commentId}`);

    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("should 404 error for inavlid comment Id", async () => {
    const bearerToken = `bearer ${global.appToken}`;
    const commentId = "12345Avd"; // invalid ID

    const res = await request
      .get(`/v1/comments/${commentId}`)
      .set("Authorization", bearerToken);

    expect(res.status).toBe(404);
    expect(res.body.message).toEqual("invalid ID");
  });
});
