const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const commentHandler = require("../../../utils/commentHandler");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);

// Cached comment responses
let oldComment;

describe("PATCH /comments/:commentId", () => {
  beforeEach(async () => {
    // Mock a comment document.
    const mockedOldCommentDoc = new CommentModel({
      content: "A comment from user 1",
      ownerId: "user1@email.com",
      origin: "135135",
      refId: 1,
      applicationId: global.application._id,
      flags: ["flagger@gmail.com"],
    });

    // Save mocked comment document to the database.
    const savedOldComment = await mockedOldCommentDoc.save();

    // Cache response objects
    oldComment = commentHandler(savedOldComment);
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(oldComment.commentId);

    // Delete cache.
    oldComment = null;
  });

  it("Should update a comment", async () => {
    const url = `/v1/comments/${oldComment.commentId}`;
    const bearerToken = `bearer ${global.appToken}`;
    const contentUpdate = "New Comment Update";

    // Run test matchers to verify that the comment has not been updated in the database.
    await CommentModel.findById(oldComment.commentId).then((comment) => {
      expect(comment).toBeTruthy();
      expect(comment.content).toEqual(oldComment.content);
    });

    // Run test matchers to verify that the comment update produced the correct success response.
    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldComment.ownerId,
        content: contentUpdate,
      });

    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toEqual({
      ownerId: oldComment.ownerId,
      content: contentUpdate,
    });

    // Run test matchers to verify that the comment has been updated in the database.
    await CommentModel.findById(oldComment.commentId).then((comment) => {
      expect(comment).toBeTruthy();
      expect(comment.content).not.toEqual(oldComment.content);
      expect(comment.content).toEqual(contentUpdate);
    });
  });

  it("Should return a 401 error when the authorization header's token is unauthorized", async () => {
    const url = `/v1/comments/${oldComment.commentId}`;
    const bearerToken = `bearer `;

    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldComment.ownerId,
        content: "content",
      });

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("Should return a 404 error when the commentId path parameter is invalid", async () => {
    const url = `/v1/comments/4edd30e86762e0fb12000003`;
    const bearerToken = `bearer ${global.appToken}`;

    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldComment.ownerId,
        content: "content",
      });

    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("Should return a 422 error when the content body property is missing or invalid", async () => {
    const url = `/v1/comments/${oldComment.commentId}`;
    const bearerToken = `bearer ${global.appToken}`;

    const missingRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldComment.ownerId,
      });

    expect(missingRes.status).toEqual(422);
    expect(missingRes.body.status).toEqual("error");
    expect(missingRes.body.data).toBeTruthy();

    const invalidRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldComment.ownerId,
        content: "",
      });

    expect(invalidRes.status).toEqual(422);
    expect(invalidRes.body.status).toEqual("error");
    expect(invalidRes.body.data).toBeTruthy();
  });

  it("Should return a 422 error when the ownerId body property is missing or invalid", async () => {
    const url = `/v1/comments/${oldComment.commentId}`;
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
