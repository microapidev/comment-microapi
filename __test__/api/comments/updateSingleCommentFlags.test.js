const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const commentHandler = require("../../../utils/commentHandler");
const supertest = require("supertest");
const request = supertest(app);

describe("PATCH /comments/:commentId/flag", () => {
  let comment;

  beforeEach(async () => {
    const comment1 = new CommentModel({
      refId: "94736880",
      applicationId: global.application._id,
      ownerId: "myuseremail@email.com",
      content: "this is a very bad comment",
      origin: "myuseremail@email.com",
    });

    const comment2Flagged = new CommentModel({
      refId: "576897564",
      applicationId: global.application._id,
      ownerId: "user1@email.com",
      content: "this is comment from user1",
      origin: "user1@email.com",
    });
    comment2Flagged.flags.push("user1@email.com");

    const comment3Flagged = new CommentModel({
      refId: "576897565",
      applicationId: global.application._id,
      ownerId: "user2@email.com",
      content: "this is comment from user2",
      origin: "user2@email.com",
    });
    comment3Flagged.flags.push("user2@email.com");

    await comment1
      .save()
      .then((item) => (comment = commentHandler(item)));
  });

  afterEach(async () => {
    await CommentModel.findByIdAndDelete(comment.commentId);

    comment = null;
  });

  test("Should return 200 and flag an unflagged comment", async () => {
    // test changes in db before endpoint operation
    await CommentModel.findById(comment.commentId).then((comment) => {
      expect(comment.flags.length).toBe(0);
    });

    const res = await request
      .patch(`/v1/comments/${comment.commentId}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "user1@email.com",
      });

    // test response from endpoint
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toMatchObject({
      numOfFlags: 1,
      commentId: comment.commentId,
    });

    // test changes in db after endpoint operation
    await CommentModel.findById(comment.commentId).then((comment) => {
      expect(comment.flags.length).toBe(1);
      expect(comment.flags).toContain("user1@email.com");
    });
  });

  test("Should return 200 and toggle user's flagged comment", async () => {
    // test changes in db before endpoint operation
    await CommentModel.findById(comment.commentId).then((comment) => {
      expect(comment.flags.length).toBe(0);
    });

    const res = await request
      .patch(`/v1/comments/${comment.commentId}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "user1@email.com",
      })
      .then(
        async () =>
          await request
            .patch(`/v1/comments/${comment.commentId}/flag`)
            .set("Authorization", `bearer ${global.appToken}`)
            .send({
              ownerId: "user2@email.com",
            })
      );

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toMatchObject({
      numOfFlags: 2,
      commentId: comment.commentId,
    });

    // test changes in db after endpoint operation
    await CommentModel.findById(comment.commentId).then((comment) => {
      expect(comment.flags.length).toBe(res.body.data.numOfFlags);
      expect(comment.flags).toContain("user1@email.com", "user2@email.com");
      expect(comment.ownerId).toEqual(comment.ownerId);
    });

    const res2 = await request
      .patch(`/v1/comments/${comment.commentId}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "user1@email.com",
      });

    expect(res2.status).toBe(200);
    expect(res2.body.status).toEqual("success");
    expect(res2.body.data).toMatchObject({
      numOfFlags: 2,
      commentId: comment.commentId,
    });

    // test changes in db after endpoint operation
    await CommentModel.findById(comment.commentId).then((comment) => {
      expect(comment.flags.length).toBe(res2.body.data.numOfFlags);
      expect(comment.ownerId).toEqual(comment.ownerId);
    });
  });

  test("Should return a 401 Authentication Error", async () => {
    const res = await request
      .patch(`/v1/comments/${comment.commentId}/flag`)
      .set("Authorization", `bearer 555`)
      .send({
        ownerId: "angrydude@yahoo.com",
      });

    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  test("Should return a 422 Error for missing 'ownerId'", async () => {
    const res = await request
      .patch(`/v1/comments/${comment.commentId}/flag`)
      .set("Authorization", `bearer ${global.appToken}`);

    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  test("Should return a 422 Error for wrong 'commentId' format", async () => {
    const res = await request
      .patch("/v1/comments/ery56788543dfhhjjkf/flag")
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "user1@email.com",
      });

    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  test("Should return a 404 Error for 'commentId' Not Found", async () => {
    const res = await request
      .patch("/v1/comments/4edd40c86762e0fb12000003/flag")
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "user1@email.com",
      });

    expect(res.status).toBe(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
