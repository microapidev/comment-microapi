const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const ReplyModel = require("../../../models/replies");
const commentHandler = require("../../../utils/commentHandler");
const replyHandler = require("../../../utils/replyHandler");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);

// Cached comment and reply responses
let oldComment, oldReply;

describe("PATCH /comments/:commentId/replies/:replyId", () => {
  beforeEach(async () => {
    // Mock a comment document.
    const mockedCommentDoc = new CommentModel({
      content: "A comment from user 1",
      ownerId: "user1@email.com",
      origin: "135135",
      refId: 1,
      applicationId: global.application._id,
      flags: ["flagger@gmail.com"],
    });

    // Mock a reply document.
    const mockedReplyDoc = new ReplyModel({
      content: "A reply from user 3",
      ownerId: "user3@email.com",
      commentId: mockedCommentDoc.id,
      flags: [mockedCommentDoc.ownerId],
    });

    // Save mocked comment document to the database.
    const savedComment = await mockedCommentDoc.save();

    // Save mocked replies document to the database.
    const savedReply = await mockedReplyDoc.save();

    // Add replies to the mocked comment.
    await CommentModel.findByIdAndUpdate(savedComment.id, {
      $push: {
        replies: { $each: [savedReply.id] },
      },
    });

    // Cache response objects
    oldComment = commentHandler(savedComment);
    oldReply = replyHandler(savedReply);
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(oldComment.commentId);
    await ReplyModel.findByIdAndDelete(oldReply.replyId);

    // Delete cache.
    oldComment = null;
    oldReply = null;
  });

  it("Should update a reply", async () => {
    const url = `/v1/comments/${oldComment.commentId}/replies/${oldReply.replyId}`;
    const bearerToken = `bearer ${global.appToken}`;
    const contentUpdate = "New Reply Update";

    // Run test matchers to verify that the reply has not been updated in the database.
    await ReplyModel.findById(oldReply.replyId).then((reply) => {
      expect(reply).toBeTruthy();
      expect(reply.content).toEqual(oldReply.content);
    });

    // Run test matchers to verify that the reply update produced the correct success response.
    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldReply.ownerId,
        content: contentUpdate,
      });

    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toEqual({
      ownerId: oldReply.ownerId,
      content: contentUpdate,
      updatedAt: oldReply.updatedAt,
    });

    // Run test matchers to verify that the reply has been updated in the database.
    await ReplyModel.findById(oldReply.replyId).then((reply) => {
      expect(reply).toBeTruthy();
      expect(reply.content).not.toEqual(oldReply.content);
      expect(reply.content).toEqual(contentUpdate);
    });
  });

  it("Should return a 401 error when the authorization header's token is unauthorized", async () => {
    const url = `/v1/comments/${oldComment.commentId}/replies/${oldReply.replyId}`;
    const bearerToken = `bearer `;

    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldReply.ownerId,
        content: "content",
      });

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("Should return a 404 error when the commentId path parameter is invalid", async () => {
    const invalidCommentUrl = `/v1/comments/4edd30e86762e0fb12000003/replies/${oldReply.replyId}`;
    const bearerToken = `bearer ${global.appToken}`;

    const invalidCommentRes = await request
      .patch(invalidCommentUrl)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldReply.ownerId,
        content: "content",
      });

    expect(invalidCommentRes.status).toEqual(404);
    expect(invalidCommentRes.body.status).toEqual("error");
    expect(invalidCommentRes.body.data).toEqual([]);
  });

  it("Should return a 404 error when the replyId path parameter is invalid", async () => {
    const invalidReplyUrl = `/v1/comments/${oldComment.commentId}/replies/4edd30e86762e0fb12000003`;
    const bearerToken = `bearer ${global.appToken}`;

    const invalidReplyRes = await request
      .patch(invalidReplyUrl)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldReply.ownerId,
        content: "content",
      });

    expect(invalidReplyRes.status).toEqual(404);
    expect(invalidReplyRes.body.status).toEqual("error");
    expect(invalidReplyRes.body.data).toEqual([]);
  });

  it("Should return a 422 error when the content body property is missing or invalid", async () => {
    const url = `/v1/comments/${oldComment.commentId}/replies/${oldReply.replyId}`;
    const bearerToken = `bearer ${global.appToken}`;

    const missingRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldReply.ownerId,
      });

    expect(missingRes.status).toEqual(422);
    expect(missingRes.body.status).toEqual("error");
    expect(missingRes.body.data).toBeTruthy();

    const invalidRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldReply.ownerId,
        content: "",
      });

    expect(invalidRes.status).toEqual(422);
    expect(invalidRes.body.status).toEqual("error");
    expect(invalidRes.body.data).toBeTruthy();
  });

  it("Should return a 422 error when the ownerId body property is missing or invalid", async () => {
    const url = `/v1/comments/${oldComment.commentId}/replies/${oldReply.replyId}`;
    const bearerToken = `bearer ${global.appToken}`;

    const missingRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        content: "content",
      });

    expect(missingRes.status).toEqual(422);
    expect(missingRes.body.status).toEqual("error");
    expect(missingRes.body.data).toBeTruthy();

    const invalidRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: 2,
        content: "content",
      });

    expect(invalidRes.status).toEqual(422);
    expect(invalidRes.body.status).toEqual("error");
    expect(invalidRes.body.data).toBeTruthy();
  });
});
