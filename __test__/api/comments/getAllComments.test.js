const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const commentHandler = require("../../../utils/commentHandler");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);

// Cached comment and reply responses
let comment1, comment2;

describe("GET /comments", () => {
  beforeEach(async () => {
    // Mock a comment document.
    const mockedComment1Doc = new CommentModel({
      content: "A comment from user 1",
      ownerId: "user1@email.com",
      origin: "123123",
      refId: 1,
      applicationId: global.application._id,
    });

    // Mock a comment document.
    const mockedComment2Doc = new CommentModel({
      content: "A comment from user 2",
      ownerId: "user2@email.com",
      origin: "135135",
      refId: 2,
      applicationId: global.application._id,
      flags: ["flagger@gmail.com"],
    });

    // Save mocked comment document to the database.
    const savedComment1 = await mockedComment1Doc.save();
    const savedComment2 = await mockedComment2Doc.save();

    // Cache response objects
    comment1 = commentHandler(savedComment1);
    comment2 = commentHandler(savedComment2);
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(comment1.commentId);
    await CommentModel.findByIdAndDelete(comment2.commentId);

    // Delete cache.
    comment1 = null;
    comment2 = null;
  });

  it("Should get all comments", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllCommentsRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    const expectedValue = [comment1, comment2];

    return getAllCommentsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("Should get all comments with a certain ownerId", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllCommentsRequest = request
      .get(url)
      .query({ ownerId: comment1.ownerId })
      .set("Authorization", bearerToken);

    const expectedValue = [comment1];

    return getAllCommentsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("Should get all comments with a certain refId", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllCommentsRequest = request
      .get(url)
      .query({ refId: comment2.refId })
      .set("Authorization", bearerToken);

    const expectedValue = [comment2];

    return getAllCommentsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("Should get all comments with a certain origin", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllCommentsRequest = request
      .get(url)
      .query({ origin: comment1.origin })
      .set("Authorization", bearerToken);

    const expectedValue = [comment1];

    return getAllCommentsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("Should get all comments that are flagged", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllCommentsRequest = request
      .get(url)
      .query({ isFlagged: true })
      .set("Authorization", bearerToken);

    const expectedValue = [comment2];

    return getAllCommentsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("Should get all comments that are unflagged", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllCommentsRequest = request
      .get(url)
      .query({ isFlagged: false })
      .set("Authorization", bearerToken);

    const expectedValue = [comment1];

    return getAllCommentsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("Should return a 401 error when authorization token is unauthorized", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer `;

    const getAllCommentsRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    return getAllCommentsRequest.then((res) => {
      expect(res.status).toEqual(401);
      expect(res.body.status).toEqual("error");
      expect(res.body.data).toEqual([]);
    });
  });
});
