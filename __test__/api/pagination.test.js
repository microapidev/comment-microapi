const CommentModel = require('../../models/comments');
const ReplyModel = require('../../models/replies');
const replyHandler = require('../../utils/replyHandler');
const app = require('../../server');
const request = require('supertest');

describe('GET /comments', () => {
  let comment, savedReply,reply;
  beforeEach(async () => {
    // Mock a comment document
    const mockedCommentDoc = new CommentModel({
      content: 'A comment from user 1',
      ownerId: 'user1@email.com',
      origin: '123123',
      refId: 2,
      applicationId: global.application._id,
    });

    // Save mocked comment document to the database and cache.
    comment = await mockedCommentDoc.save();

    // Mock a reply document.
    const mockedReply1Doc = new ReplyModel({
      content: 'A reply from user 2',
      ownerId: 'user2@email.com',
      commentId: comment.id,
    });

    // Save mocked replies document to the database.
    savedReply = await mockedReply1Doc.save();

    // Add replies to the mocked comment.
    await CommentModel.findByIdAndUpdate(comment.id, {
      $push: {
        replies: { $each: [savedReply.replyId] },
      },
    });

    // Cache response objects
    reply = replyHandler(savedReply);
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(comment.id);
    await ReplyModel.findByIdAndDelete(reply.replyId);

    // Delete cache.
    comment = null;
    reply = null;
  });

  test('Should return error on limit exceeded on GET /comments', async () => {
    const res = await request(app)
      .get('/v1/comments')
      .query({ limit: 60 })
      .set('Authorization', `Bearer ${global.appToken}`);
    expect(res.status).toBe(422);
    expect(res.body.status).toEqual('error');
    expect(res.body.data).toEqual([]);
  });

  test('Should return error on limit exceeded on GET ../replies', async () => {
    const res = await request(app)
      .get(`/v1/comments/${comment.commentId}/replies`)
      .query({ limit: 60 })
      .set('Authorization', `Bearer ${global.appToken}`);
    expect(res.status).toBe(422);
    expect(res.body.status).toEqual('error');
    expect(res.body.data).toEqual([]);
  });
});
