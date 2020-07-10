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
    //dummy comment document
    const dummyComment = new CommentModel({
      content: "A comment from user 1",
      ownerId: "user1@email.com",
      origin: "123123",
      refId: 2,
      applicationId: global.application._id,
    });
    //dummy replies document
    const dummyReply = new ReplyModel({
      content: "A reply from user 2",
      ownerId: "user2@email.com",
      commentId: dummyComment._id,
    });

    const savedR = await dummyReply.save();
    dummyComment.replies.push(savedR.id);
    const savedC = await dummyComment.save();

    //Cache response objects
    comment = commentHandler(savedC);
    reply = replyHandler(savedR);
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
    await ReplyModel.findById(reply.replyId).then((item) => {
      expect(replyHandler(item)).toMatchObject(reply);
    });

    await CommentModel.findById(comment.commentId).then((item) => {
      expect(item.replies).toHaveLength(comment.numOfReplies);
    });

    const res = await request
      .delete(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: reply.ownerId,
      });
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toMatchObject(reply);

    await CommentModel.findById(comment.commentId).then((item) => {
      expect(commentHandler(item).numOfReplies).toBe(comment.numOfReplies - 1);
    });
    //add matchers to check db that comment no longer has deleted replies
    // const comms = await CommentModel.findById(comment.commentId);
    //  expect(comms.replies).notContains(reply.replyId)

    await ReplyModel.findById(reply.replyId).then((item) => {
      expect(item).toBeNull();
    });
  });

  //401 error
  test("Should return error when the authorization header's token is unauthorized", async () => {
    const url = `/v1/comments/${comment.commentId}/replies/${reply.replyId}`;
    const bearerToken = `bearer `;

    const res = await request
      .delete(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: reply.ownerId,
      });

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  //404 error
  test("Should return a 404 error when the commentId or replyId path parameter is invalid", async () => {
    const invalidCommentUrl = `/v1/comments/4edd30e86762e0fb12000003/replies/${reply.replyId}`;
    const invalidReplyUrl = `/v1/comments/${comment.commentId}/replies/4edd30e86762e0fb12000003`;
    const bearerToken = `bearer ${global.appToken}`;

    const invalidCommentRes = await request
      .delete(invalidCommentUrl)
      .set("Authorization", bearerToken)
      .send({
        ownerId: reply.ownerId,
      });

    expect(invalidCommentRes.status).toEqual(404);
    expect(invalidCommentRes.body.status).toEqual("error");
    expect(invalidCommentRes.body.data).toEqual([]);

    const invalidReplyRes = await request
      .delete(invalidReplyUrl)
      .set("Authorization", bearerToken)
      .send({
        ownerId: reply.ownerId,
      });

    expect(invalidReplyRes.status).toEqual(404);
    expect(invalidReplyRes.body.status).toEqual("error");
    expect(invalidReplyRes.body.data).toEqual([]);
  });

  //422 error
  test("Should return a 422 error when the ownerId body property is missing or invalid", async () => {
    const url = `/v1/comments/${comment.commentId}/replies/${reply.replyId}`;
    const bearerToken = `bearer ${global.appToken}`;

    const mRes = await request
      .delete(url)
      .set("Authorization", bearerToken)
      .send({});

    expect(mRes.status).toEqual(422);
    expect(mRes.body.status).toEqual("error");
    expect(mRes.body.data).toBeTruthy();

    const invalidRes = await request
      .delete(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: 7,
      });

    expect(invalidRes.status).toEqual(422);
    expect(invalidRes.body.status).toEqual("error");
    expect(invalidRes.body.data).toBeTruthy();
  });
});
