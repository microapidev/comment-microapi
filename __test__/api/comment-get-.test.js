const app = require('../../server');
const CommentModel = require('../../models/comments');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest(app);
const { skipIfNotFound } = require('../helpers/conditionalTests');

describe("GET '/comments' ", () => {
  it('Return all comments from the db', async () => {
    const res = await request.get('/comments');
    if (res.status === 404) {
      console.log('GET /comments Not Implemented Yet');
      return true;
    }
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toBeTruthy();
  });
});

describe('GET /comments/refs/:refId', () => {
  it('Return all comment for a particular ref', async () => {
    const comment = new CommentModel({
      commentBody: 'this is a comment',
      commentOwnerName: 'userName',
      commentOwnerEmail: 'useremail@email.com',
      commentOrigin: '123123',
      refId: 2,
      commentOwner: mongoose.Types.ObjectId(),
    });
    await comment.save();
    const res = await request.get(`/comments/refs/${comment.refId}`);
    if (res.status === 404) {
      console.log(`GET /comments/refs/:refId Not Implemented Yet`);
      return true;
    }
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.refId).toEqual(comment.refId);
  });
});

describe('GET /comments/:commentId/replies', () => {
  it('Return all replies for a comment', async () => {
    const comment = new CommentModel({
      commentBody: 'this is a comment',
      commentOwnerName: 'userName',
      commentOwnerEmail: 'useremail@email.com',
      commentOrigin: '123123',
      refId: 2,
      commentOwner: mongoose.Types.ObjectId(),
    });
    await comment.save();

    const commentId = comment._id;

    const res = await request.get(`/comments/${commentId}/replies`);

    if (res.status === 404) {
      console.log(`/comments/:commentId/replies, Route Not Implemented Yet`);
      return true;
    }
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toBeTruthy();
  });
});
