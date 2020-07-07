const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const supertest = require("supertest");
const request = supertest(app);

describe("PATCH /comments/:commentId/flag", () => {
  let sampleComment = {
    refId: "4edd40c86762e0fb12000003",
    applicationId: global.application._id,
    ownerId: "useremail@email.com",
    content: "this is a comment",
    origin: "useremail@email.com",
  };

  afterEach(async () => {
    await CommentModel.findByIdAndDelete(sampleComment._id);
    // eslint-disable-next-line no-const-assign
    sampleComment = null;
  });

  test("200 - Flag a single comment", async () => {
    const comment = new CommentModel({
      refId: sampleComment.refId,
      applicationId: sampleComment.applicationId,
      ownerId: sampleComment.ownerId,
      content: sampleComment.content,
      origin: sampleComment.origin,
    });
    await comment.save();
    const res = await request
      .patch(`/v1/comments/${comment._id}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "offendeduser@email.com",
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.numOfFlags).toBeTruthy();
    expect(comment.applicationId).toEqual(global.application._id);
    expect(res.body.data).toMatchObject(comment);
  });

  test("Should return 401 authentication error", async () => {
    const comment = new CommentModel({
      refId: sampleComment.refId,
      applicationId: sampleComment.applicationId,
      ownerId: sampleComment.ownerId,
      content: sampleComment.content,
      origin: sampleComment.origin,
    });
    await comment.save();
    const res = await request
      .patch(`/v1/comments/${comment._id}/flag`)
      .set("Authorization", `bearer 555`)
      .send({
        ownerId: "offendeduser@email.com",
      });

    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  test("Should return 422 validation", async () => {
    const res = await request
      .patch(`/v1/comments/56574/flag`)
      .set("Authorization", `bearer 234`)
      .send({
        ownerId: "offendeduser@email.com",
      });

    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  test("Should return 404 Invalid ID error", async () => {
    const comment = new CommentModel({
      refId: sampleComment.refId,
      applicationId: sampleComment.applicationId,
      ownerId: null,
      content: sampleComment.content,
      origin: sampleComment.origin,
    });
    await comment.save();
    const res = await request
      .patch(`/v1/comments/${comment._id}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "offendeduser@email.com",
      });

    expect(res.status).toBe(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
