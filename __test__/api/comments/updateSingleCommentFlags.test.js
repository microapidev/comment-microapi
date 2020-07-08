const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const commentHandler = require("../../../utils/commentHandler");
const supertest = require("supertest");
const request = supertest(app);

describe("PATCH /comments/:commentId/flag", () => {
  let sampleComment, sampleComment2;

  beforeEach(async () => {
    const comment = new CommentModel({
      refId: "94736880",
      applicationId: global.application._id,
      ownerId: "myuseremail@email.com",
      content: "this is a very bad comment",
      origin: "myuseremail@email.com",
    });

    const comment2 = new CommentModel({
      refId: "576897564",
      applicationId: global.application._id,
      ownerId: "anotheruseremail@email.com",
      content: "this is a very bad comment with an non-valid ownerId",
      origin: "myuseremail@email.com",
    });

    const commentOne = await comment.save();
    const commentTwo = await comment2.save();

    sampleComment = commentHandler(commentOne);
    sampleComment2 = commentHandler(commentTwo);
  });

  afterEach(async () => {
    await CommentModel.findByIdAndDelete(sampleComment.commentId);
    await CommentModel.findByIdAndDelete(sampleComment2.commentId);

    sampleComment = null;
    sampleComment2 = null;
  });

  test("Flag a single comment. Should return 200", async () => {
    const res = await request
      .patch(`/v1/comments/${sampleComment.commentId}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: sampleComment2.ownerId,
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.numOfFlags).toBeTruthy();

    //Match db records to verify test mockup
    await CommentModel.findById(sampleComment.commentId).then((comment) => {
      expect(comment).toBeTruthy();
      expect(comment.flags).toBeTruthy();
      expect(comment.flags).toContain(sampleComment2.ownerId);
    });
  });

  test("Should return 401 authentication error", async () => {
    const res = await request
      .patch(`/v1/comments/${sampleComment.commentId}/flag`)
      .set("Authorization", `bearer 555`)
      .send({
        ownerId: "angrydude@yahoo.com",
      });

    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
    expect(res.body.data).toEqual([]);
  });

  test("Should return 422 Invalid ID Error", async () => {
    const res = await request
      .patch(`/v1/comments/56574/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "offendeduser@email.com",
      });

    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
    expect(res.body.data).toEqual([]);
  });

  test("Should return 404 validation error", async () => {
    const res = await request
      .patch(`/v1/comments/${sampleComment.commentId}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: " michymich@ gmail.com",
      });

    expect(res.status).toBe(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
