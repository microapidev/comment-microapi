const app = require('../server');
const Comments = require('../models/comments');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');

describe('GET Comments Endpoints', () => {
  //   it('gets all comments from the db', async (done) => {
  //     const res = await request.get('/comments');
  //     expect(res.status).toBe(200);
  //     expect(res.body.status).toBe('success');
  //     expect(res.body.message).toBe('Comments Retrieved Successfully');
  //     done();
  //     done();
  //   });

  it('gets all comment for a particular ref', async (done) => {
    // const refId = request.params.refId;
    // const res = await request.get('/comments/refs/' + refId);
    // expect(request.body).toHaveProperty('refId');
    // expect(res.status).toBe(200);
    // expect(res.body.status).toBe('success');
    // expect(res.body.data).toContain({ refId: refId });
    const refId = 2;
    let ress = await Comments.find({});
    console.log(ress);
    done();
  });

  //   it('gets all replies for a comment', async (done) => {
  //     const commentId = request.params.commentId;
  //     const res = await request.get('/comments/replies/' + commentId);
  //     expect(res.status).toBe(200);
  //     expect(res.body.status).toBe('success');
  //     expect(res.body.data.commentId).toBe(commentId);
  //     done();
  //   });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 6000));
    await mongoose.disconnect();
  });
});
