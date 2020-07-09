const app = require("../../../server");
const supertest = require("supertest");
const CommentModel = require("../../../models/comments");
const ReplyModel = require("../../../models/replies");
const commentHandler = require("../../../utils/commentHandler");
const replyHandler = require("../../../utils/replyHandler");
const request = supertest(app);

describe("POST /comments", () => {
  let comment;

  beforeEach(async () => {
    const tempComment = new CommentModel({
      refId: "94736880",
      applicationId: global.application._id,
      ownerId: "myuseremail@email.com",
      content: "this is a very bad comment",
      origin: "myuseremail@email.com",
    });

    await tempComment.save().then((item) => (comment = commentHandler(item)));
  });

  afterEach(async () => {
    await CommentModel.findByIdAndDelete(comment.commentId);
    comment = null;
  });

  test("Should create reply", async () => {
    // test changes in db before endpoint operation
    await CommentModel.findById(comment.commentId).then((expected) => {
      expect(expected.replies.length).toBe(0);
    });
    const res = await request
      .post(`/v1/comments/${comment.commentId}/replies`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "user1@email.com",
        content: "this is a bad reply",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toEqual("success");

    await ReplyModel.findById(res.body.data.replyId)
      .lean()
      .then(async (expectedReply) => {
        expect(res.body.data).toMatchObject(replyHandler(expectedReply));
        await CommentModel.findById(expectedReply.commentId)
          .lean()
          .then((expectedComment) => {
            expect(expectedComment.replies.length).toBe(1);
            expect(expectedComment.replies).toContainEqual(expectedReply._id);
          });
      });
  });

  test("Should return 404 error when 'commentId' not in db", async () => {
    const res = await request
      .post("/v1/comments/4edd40c86762e0fb12000003/replies")
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "user1@email.com",
        content: "this is a bad reply",
      });
    expect(res.status).toBe(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  test("Should return 422 error when 'content' parameter missing", async () => {
    const res = await request
      .post(`/v1/comments/${comment.commentId}/replies`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "user1@email.com",
      });
    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  test("Should return 422 error when 'ownerId' parameter missing", async () => {
    const res = await request
      .post(`/v1/comments/${comment.commentId}/replies`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        content: "this is a bad reply",
      });
    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  test("Should return 401 error for 'Unauthorized' token", async () => {
    const res = await request
      .post(`/v1/comments/${comment.commentId}/replies`)
      .set("Authorization", `bearer ert4567r`);
    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
