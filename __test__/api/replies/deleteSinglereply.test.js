const app = require("../../../server");
const supertest = require("supertest");
const ReplyModel = require("../../../models/replies");
const CommentModel = require("../../../models/comments");
const commentHandler = require("../../../utils/commentHandler");
const replyHandler = require("../../../utils/replyHandler");
const request = supertest(app);

describe("DELETE /comments/:commentId/replies/:replyId", () => {
  let comment;
  let reply;

  beforeEach(async () => {
    const dummyComment = new CommentModel({
      content: "A comment from user 1",
      ownerId: "user1@email.com",
      origin: "123123",
      refId: 2,
      applicationId: global.application._id,
    });

    const dummyReply = new ReplyModel({
      content: "A reply from user 2",
      ownerId: "user2@email.com",
      commentId: dummyComment.id,
    });

    //save dummy comment
    dcomment = await dummyComment.save();
    dreply1 = await dummyReply.save();

    // Add replies to the dummy comment
    await CommentModel.findByIdAndUpdate(dcomment.id, { replies: dreply1.id });

    // Cache response objects
    comment = commentHandler(dcomment);
    reply = replyHandler(dreply1);
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(comment.commentId);
    await ReplyModel.findByIdAndDelete(reply.replyId);

    // Delete cache.
    comment = null;
    reply = null;
  });

  //200 success
  test("should delete a single reply", async () => {
    const url = `/v1/comments/${comment.commentId}/replies/${reply.replyId}`;
    const bearerToken = `bearer ${global.appToken}`;

    const res = await request
      .delete(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: reply.ownerId,
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toEqual({
      ownerId: reply.ownerId,
    });
    ReplyModel.findById(reply.replyId).then((item) => {
      expect(item).toBeNull();
    });
  });
  //404 not found
  test("Should return not found error when replyId not in db", async () => {
    const url = `/v1/comments/${comment.commentId}/replies/${reply.replyId}`;
    const bearerToken = `bearer ${global.appToken}`;

    const res = await request
      .delete(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId:reply.ownerId,
      });

    expect(res.status).toBe(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  // 422 validation error
  test("Should return validation error when ownerId is missing", async () => {
    const url = `/v1/comments/${comment.commentId}/replies/${reply.replyId}`;
    const bearerToken = `bearer ${global.appToken}`;

    const res = await request
      .delete(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: reply.ownerId,
      });

    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  // 401 unauthorized requests
  test("Should return authentication error when invalid token", async () => {
    const bearerToken = `bearer ${global.appToken}`;
    const res = await request
      .delete(`/v1/comments/4edd40c86762e0fb12000003/replies/`)
      .set("Authorization", bearerToken)
      .send({
        ownerId: reply.ownerId,
      });

    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
