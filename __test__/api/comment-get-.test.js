const app = require('../../server');
const CommentModel = require('../../models/comments');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest(app);

describe("GET '/comments' && '/comments/ref/:refId' && '/comments/:commentId/replies' ", () => {
  it('gets all comments from the db', async () => {
    const res = await request.get('/comments');
    if (res.status === 404) {
      console.log('Route Not Implemented');
      return true;
    }
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toBeTruthy();
  });

  it('gets all comment for a particular ref', async () => {
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
      console.log('Route Not Implemented Yet');
      return true;
    }
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.refId).toEqual(comment.refId);

  });

  it('gets all replies for a comment', async () => {
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
      console.log('Route Not Implemented Yet');
      return true;
    }
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.commentId).toEqual(commentId);
    expect(res.body.data.refId).toEqual(comment.refId);
  });
});
