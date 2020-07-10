const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const ReplyModel = require("../../../models/replies");
const supertest = require("supertest");
const mongoose = require("mongoose");
const request = supertest(app);

describe("PATCH /v1/comments/:commentId/replies/:replyId/flag", () => {
  let savedComment, savedReply, url;
  beforeAll(async () => {
    const Comment = new CommentModel({
      content: "this is a comment",
      ownerId: "owner@hotels.ng",
      applicationId: global.application._id,
    });
    savedComment = await Comment.save();

    const Reply = new ReplyModel({
      content: "this is a reply to a comment",
      commentId: Comment._id,
      ownerId: "replier@hotels.ng",
    });
    savedReply = await Reply.save();
    url = `/v1/comments/${savedComment._id}/replies/${savedReply._id}/flag`;
  });

  it("toggles flag on reply to a comment", async () => {
    // send two flag requests
    await request
      .patch(url)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({ ownerId: "offendeduser1@gmail.com" });

    let res = await request
      .patch(url)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "offendeduser2@email.com",
      });

    let updatedReply = await ReplyModel.findById(savedReply._id);

    expect(res.status).toBe(200);
    expect(res.body.message).toBeTruthy();
    expect(res.body.data.commentId).toEqual(String(savedComment._id));
    expect(res.body.data.replyId).toEqual(String(savedReply._id));
    expect(res.body.data.numOfFlags).toEqual(updatedReply.flags.length);

    // unflag offendeduser1
    res = await request
      .patch(url)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({ ownerId: "offendeduser1@gmail.com" });

    // make sure it's decremented
    expect(res.body.data.numOfFlags).toEqual(updatedReply.flags.length - 1);

    updatedReply = await ReplyModel.findById(savedReply._id);

    // make sure the change is reflected in the database
    expect(res.body.data.numOfFlags).toEqual(updatedReply.flags.length);
  });

  it("returns 404 for unknown comments", async () => {
    let fakeId = mongoose.Types.ObjectId();
    let res = await request
      .patch(`/v1/comments/${fakeId}/replies/${savedReply._id}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "offendeduser2@email.com",
      });
    expect(res.status).toBe(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.error.toLowerCase()).toEqual(
      expect.stringContaining("comment")
    );
  });

  it("returns 404 for unknown replies", async () => {
    let fakeId = mongoose.Types.ObjectId();
    let res = await request
      .patch(`/v1/comments/${savedComment._id}/replies/${fakeId}/flag`)
      .set("Authorization", `bearer ${global.appToken}`)
      .send({
        ownerId: "offendeduser2@email.com",
      });
    expect(res.status).toBe(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.error.toLowerCase()).toEqual(
      expect.stringContaining("reply")
    );
  });

  it("returns authentication error for unauthorized user", async () => {
    let res = await request.patch(url).send({
      ownerId: "offendeduser2@email.com",
    });
    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("Should return validation error on missing inputs", async () => {
    const res = await request
      .patch(url)
      .set("Authorization", `bearer ${global.appToken}`);
    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toEqual(expect.stringContaining("input"));
  });
});
