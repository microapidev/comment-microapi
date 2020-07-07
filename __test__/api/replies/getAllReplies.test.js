const app = require("../../../server");
const ReplyModel = require("../../../models/replies");
const CommentModel = require("../../../models/comments");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);

// Cached comment and reply
let comment;
let reply1, reply2;

describe("get all replies", () => {
  beforeEach(async () => {
    // Mock a comment document.
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

    // Save mocked replies document to the database and cache.
    reply1 = await mockedReply1Doc.save();
    reply2 = await mockedReply2Doc.save();

    // Add replies to the mocked comment.
    await CommentModel.findByIdAndUpdate(comment.id, {
      $push: {
        replies: { $each: [reply1.id, reply2.id] },
      },
    });
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(comment.id);
    await ReplyModel.findByIdAndDelete(reply1.id);

    // Delete cache.
    comment = null;
    reply1 = null;
    reply2 = null;
  });

  it("given a valid comment ID", () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    const expectedValue = [
      {
        replyId: reply1.id,
        commentId: reply1.commentId.toString(),
        ownerId: reply1.ownerId,
        content: reply1.content,
        numOfVotes: reply1.upVotes.length + reply1.downVotes.length,
        numOfUpVotes: reply1.upVotes.length,
        numOfDownVotes: reply1.downVotes.length,
        numOfFlags: reply1.flags.length,
      },
      {
        replyId: reply2.id,
        commentId: reply2.commentId.toString(),
        ownerId: reply2.ownerId,
        content: reply2.content,
        numOfVotes: reply2.upVotes.length + reply2.downVotes.length,
        numOfUpVotes: reply2.upVotes.length,
        numOfDownVotes: reply2.downVotes.length,
        numOfFlags: reply2.flags.length,
      },
    ];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("given a valid comment ID and filtered by ownerId", () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ ownerId: reply1.ownerId })
      .set("Authorization", bearerToken);

    const expectedValue = [
      {
        replyId: reply1.id,
        commentId: reply1.commentId.toString(),
        ownerId: reply1.ownerId,
        content: reply1.content,
        numOfVotes: reply1.upVotes.length + reply1.downVotes.length,
        numOfUpVotes: reply1.upVotes.length,
        numOfDownVotes: reply1.downVotes.length,
        numOfFlags: reply1.flags.length,
      },
    ];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("given a valid comment ID and filtered by isFlagged for only flagged replies", () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ isFlagged: true })
      .set("Authorization", bearerToken);

    const expectedValue = [
      {
        replyId: reply2.id,
        commentId: reply2.commentId.toString(),
        ownerId: reply2.ownerId,
        content: reply2.content,
        numOfVotes: reply2.upVotes.length + reply2.downVotes.length,
        numOfUpVotes: reply2.upVotes.length,
        numOfDownVotes: reply2.downVotes.length,
        numOfFlags: reply2.flags.length,
      },
    ];

    return getAllRepliesRequest.then((res) => {
      console.log(res.body.data);
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data).toEqual(expectedValue);
    });
  });

  it("given an invalid comment ID", () => {
    const url = `/v1/comments/5eff06f9fa2a9a0017469f54/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(404);
      expect(res.body.status).toEqual("error");
      expect(res.body.data).toEqual([]);
    });
  });

  it("given a valid comment ID but unauthorized bearer token", () => {
    const url = `/v1/comments/${comment.id}/replies`;
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
