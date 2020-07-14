const app = require('../../../server');
const ReplyModel = require('../../../models/replies');
const CommentModel = require('../../../models/comments');
const replyHandler = require('../../../utils/replyHandler');
// const mongoose = require("mongoose");
const supertest = require('supertest');
const request = supertest(app);

// Cached comment and reply
let comment;
let reply1, reply2;

describe('GET /comments/:commentId/replies', () => {
  beforeEach(async () => {
    // Mock a comment document.
    const mockedCommentDoc = new CommentModel({
      content: 'A comment from user 1',
      ownerId: 'user1@email.com',
      origin: '123123',
      refId: 2,
      applicationId: global.application._id,
    });

    // Mock a reply document.
    const mockedReply1Doc = new ReplyModel({
      content: 'A reply from user 2',
      ownerId: 'user2@email.com',
      commentId: mockedCommentDoc.id,
    });

    // Mock a reply document.
    const mockedReply2Doc = new ReplyModel({
      content: 'A reply from user 3',
      ownerId: 'user3@email.com',
      commentId: mockedCommentDoc.id,
      flags: [mockedCommentDoc.ownerId],
    });

    // Save mocked comment document to the database and cache.
    comment = await mockedCommentDoc.save();

    // Save mocked replies document to the database.
    const savedReply1 = await mockedReply1Doc.save();
    const savedReply2 = await mockedReply2Doc.save();

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

  it('Should get all replies of a comment', () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .set('Authorization', bearerToken);

    const expectedValue = [reply1, reply2];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it('Should get all replies, with a certain ownerId, of a comment', () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ ownerId: reply1.ownerId })
      .set('Authorization', bearerToken);

    const expectedValue = [reply1];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it('Should get all flagged replies of a comment', () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ isFlagged: true })
      .set('Authorization', bearerToken);

    const expectedValue = [reply2];

    return getAllRepliesRequest.then((res) => {
      // console.log(res.body.data.records);
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it('Should get all unflagged replies of a comment', () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ isFlagged: false })
      .set('Authorization', bearerToken);

    const expectedValue = [reply1];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it('Should get all replies with set limit', () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ limit: 1 })
      .set('Authorization', bearerToken);

    const expectedValue = [reply1];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it('Should get all replies with set page', () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ page: 1 })
      .set('Authorization', bearerToken);

    const expectedValue = [reply1,reply2];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it('Should get all replies with set sort type', () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ sort: 'asc' })
      .set('Authorization', bearerToken);

    const expectedValue = [reply1, reply2];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it('Should get all replies with all pagination params set', () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .query({ limit: 1, page: 1, sort: 'asc' })
      .set('Authorization', bearerToken);

    const expectedValue = [reply1];

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it('Should return a 401 error when authorization token is unauthorized', () => {
    const url = `/v1/comments/${comment.id}/replies`;
    const bearerToken = `bearer `;

    const getAllRepliesRequest = request
      .get(url)
      .set('Authorization', bearerToken);

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(401);
      expect(res.body.status).toEqual('error');
      expect(res.body.data).toEqual([]);
    });
  });

  it('Should return a 404 error when commentId is not an existing ID', () => {
    const url = `/v1/comments/5eff06f9fa2a9a0017469f54/replies`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllRepliesRequest = request
      .get(url)
      .set('Authorization', bearerToken);

    return getAllRepliesRequest.then((res) => {
      expect(res.status).toEqual(404);
      expect(res.body.status).toEqual('error');
      expect(res.body.data).toEqual([]);
    });
  });
});
