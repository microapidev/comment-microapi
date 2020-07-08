const app = require("../../../server");
const supertest = require("supertest");
const CommentModel = require("../../../models/comments");
const commentHandler = require("../../../utils/commentHandler");
const request = supertest(app);

describe("DELETE /v1/comments/:commentId", () => {
  let comment;

  beforeEach(async () => {
    comment = new CommentModel({
      refId: "4edd40c86762e0fb12000003",
      applicationId: global.application._id,
      content: "A mock comment from user1",
      ownerId: "user1@email.com",
      origin: "b12000003",
    });
    await comment.save();
  });

  afterEach(async () => {
    await CommentModel.findByIdAndDelete(comment._id);
    comment = null;
  });

  // 200 success
  test("Should delete a comment", async () => {
    const expected = commentHandler(comment);
    CommentModel.findById(expected.commentId).then((item) => {
      expect(commentHandler(item)).toMatchObject(expected);
    });

    const res = await request
      .delete(`/v1/comments/${expected.commentId}`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: expected.ownerId,
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toMatchObject(expected);

    CommentModel.findById(expected.commentId).then((item) => {
      expect(item).toBeNull();
    });
  });

  // 404 not found error
  test("Should return not found error when commentId not in db", async () => {
    const res = await request
      .delete("/v1/comments/4edd40c86762e0fb12000003")
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "rogueuser@email.com",
      });

    expect(res.status).toBe(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  // 404 not found error
  test("Should return not found error when commentId not match ObjectId", async () => {
    const res = await request
      .delete("/v1/comments/62e0fb12000003")
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "rogueuser@email.com",
      });

    expect(res.status).toBe(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  // 422 validation error
  test("Should return validation error when ownerId is missing", async () => {
    const expected = commentHandler(comment);
    const res = await request
      .delete(`/v1/comments/${expected.commentId}`)
      .set("Authorization", `bearer ${global.appToken}`);

    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  // 401 unauthorized requests
  test("Should return authentication error when invalid token", async () => {
    const res = await request
      .delete(`/v1/comments/4edd40c86762e0fb12000003`)
      .set("Authorization", "bearer 4edd40c86762e0fb12000003")
      .send({
        ownerId: "rogueuser@email.com",
      });

    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
