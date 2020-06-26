const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');

describe('Comments Endpoints', () => {
  it('gets all comments from the db', async (done) => {
    const res = await request.get('/comments');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
      expect(res.body).toHaveProperty('data');
    done();
  });

  it('posts a new comment to the db', async (done) => {
    const res = await request
      .post('/comments')
      .set('Accept', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    done();
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 6000));
    await mongoose.disconnect();
  });
});
