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
      upVotes: ["sally@gmail.com", "shully@gmail.com", "kelly@gmail.com"],
      downVotes: ["rally@gmail.com", "molly@gmail.com"],
    });

    const comment2 = new CommentModel({
      refId: "576897564",
      applicationId: global.application._id,
      ownerId: "anotheruseremail@email.com",
      content: "this is another comment ",
      origin: "myuseremail@email.com",
      upVotes: ["pally@gmail.com"],
      downVotes: ["tally@gmail.com"],
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
    //check that the db has not been updated
    await CommentModel.findById(sampleComment.commentId).then((comment) => {
      expect(comment.flags.length).toEqual(sampleComment.numOfFlags);
      expect(comment.ownerId).toEqual(sampleComment.ownerId);
    });

    const res = await request
      .patch(`/v1/comments/${sampleComment.commentId}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: sampleComment2.ownerId,
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toBeTruthy();

    //Match db records to verify test mockup
    await CommentModel.findById(sampleComment.commentId).then((comment) => {
      const updatedComment = commentHandler(comment);

      expect(updatedComment).toEqual({
        ...sampleComment,
        numOfFlags: sampleComment.numOfFlags + 1,
      });
    });
  });

  it("It should return same number of flags if user has already flagged the comment", async () => {
    await CommentModel.findById(sampleComment.commentId).then((comment) => {
      expect(comment.flags.length).toEqual(sampleComment.numOfFlags);
      expect(comment.ownerId).toEqual(sampleComment.ownerId);
    });

    const res2 = await request
      .patch(`/v1/comments/${sampleComment.commentId}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: sampleComment.ownerId,
      });
    expect(res2.status).toBe(200);
    expect(res2.body.status).toEqual("success");
    expect(res2.body.data).toBeTruthy();

    //number of flags in db should be same for both requests by same ownerId
    await CommentModel.findById(sampleComment.commentId).then((comment) => {
      const updatedComment = commentHandler(comment);

      expect(updatedComment).toEqual({
        ...sampleComment,
        numOfFlags: sampleComment.numOfFlags + 1,
      });
    });
  });

  test("Should return a 401 Authentication Error", async () => {
    const res = await request
      .patch(`/v1/comments/${sampleComment.commentId}/flag`)
      .set("Authorization", `bearer 555`)
      .send({
        ownerId: "angrydude@yahoo.com",
      });

    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  test("Should return a 422 Validation Error if ownerId is missing or incorrect", async () => {
    const res = await request
      .patch(`/v1/comments/${sampleComment.commentId}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({ ownerId: 365537 });

    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  test("Should return a 422 Validation Error if commentId is invalid", async () => {
    const res = await request
      .patch(`/v1/comments/56574/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "offendeduser@email.com",
      });

    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
