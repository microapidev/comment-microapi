const app = require("../../../server");
const CommentModel = require("../../../models/comments");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);

// Cached comment and reply responses
let comment1, comment2;

describe("get all comments", () => {
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
    comment1 = {
      commentId: savedComment1.id,
      applicationId: savedComment1.applicationId.toString(),
      refId: savedComment1.refId,
      ownerId: savedComment1.ownerId,
      content: savedComment1.content,
      origin: savedComment1.origin,
      numOfReplies: savedComment1.replies.length,
      numOfVotes: savedComment1.upVotes.length + savedComment1.downVotes.length,
      numOfUpVotes: savedComment1.upVotes.length,
      numOfDownVotes: savedComment1.downVotes.length,
      numOfFlags: savedComment1.flags.length,
    };

    comment2 = {
      commentId: savedComment2.id,
      applicationId: savedComment2.applicationId.toString(),
      refId: savedComment2.refId,
      ownerId: savedComment2.ownerId,
      content: savedComment2.content,
      origin: savedComment2.origin,
      numOfReplies: savedComment2.replies.length,
      numOfVotes: savedComment2.upVotes.length + savedComment2.downVotes.length,
      numOfUpVotes: savedComment2.upVotes.length,
      numOfDownVotes: savedComment2.downVotes.length,
      numOfFlags: savedComment2.flags.length,
    };
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(comment1.commentId);
    await CommentModel.findByIdAndDelete(comment2.commentId);

    // Delete cache.
    comment1 = null;
    comment2 = null;
  });

  it("given a valid request", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    const expectedValue = [comment1, comment2];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("given a valid request and filtered by ownerId", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ ownerId: comment1.ownerId })
      .set("Authorization", bearerToken);

    const expectedValue = [comment1];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("given a valid request and filtered by refId", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ refId: comment2.refId })
      .set("Authorization", bearerToken);

    const expectedValue = [comment2];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("given a valid request and filtered by origin", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ origin: comment1.origin })
      .set("Authorization", bearerToken);

    const expectedValue = [comment1];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("given a valid request and filtered by isFlagged for only flagged replies", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ isFlagged: true })
      .set("Authorization", bearerToken);

    const expectedValue = [comment2];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("given a valid comment ID and filtered by isFlagged for only unflagged replies", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ isFlagged: false })
      .set("Authorization", bearerToken);

    const expectedValue = [comment1];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("given a valid comment ID but unauthorized bearer token", () => {
    const url = `/v1/comments`;
    const bearerToken = `bearer `;

    const getAllRepliesRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(401);
      expect(res.body.status).toEqual("error");
      expect(res.body.data).toEqual([]);
    });
  });
});
