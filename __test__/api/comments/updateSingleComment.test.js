const app = require("../../../server");
const CommentModel = require("../../../models/comments");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);

// Cached comment responses
let oldComment;

describe("PATCH /comments/:commentId", () => {
  beforeEach(async () => {
    // Mock a comment document.
    const mockedOldCommentDoc = new CommentModel({
      content: "A comment from user 1",
      ownerId: "user1@email.com",
      origin: "135135",
      refId: 1,
      applicationId: global.application._id,
      flags: ["flagger@gmail.com"],
    });

    // Save mocked comment document to the database.
    const savedOldComment = await mockedOldCommentDoc.save();

    // Cache response objects
    oldComment = {
      commentId: savedOldComment.id,
      applicationId: savedOldComment.applicationId.toString(),
      refId: savedOldComment.refId,
      ownerId: savedOldComment.ownerId,
      content: savedOldComment.content,
      origin: savedOldComment.origin,
      numOfReplies: savedOldComment.replies.length,
      numOfVotes:
        savedOldComment.upVotes.length + savedOldComment.downVotes.length,
      numOfUpVotes: savedOldComment.upVotes.length,
      numOfDownVotes: savedOldComment.downVotes.length,
      numOfFlags: savedOldComment.flags.length,
    };
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(oldComment.commentId);

    // Delete cache.
    oldComment = null;
  });

  it("Should update a comment", async () => {
    const url = `/v1/comments/${oldComment.commentId}`;
    const bearerToken = `bearer ${global.appToken}`;
    const contentUpdate = "New Comment Update";

    // Run test matchers to verify that the comment has not been updated in the database.
    await CommentModel.findById(oldComment.commentId).then((comment) => {
      expect(comment).toBeTruthy();
      expect(comment.content).toEqual(oldComment.content);
    });

    // Run test matchers to verify that the comment update produced the correct success response.
    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldComment.ownerId,
        content: contentUpdate,
      });

    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toEqual({
      ownerId: oldComment.ownerId,
      content: contentUpdate,
    });

    // Run test matchers to verify that the comment has been updated in the database.
    await CommentModel.findById(oldComment.commentId).then((comment) => {
      expect(comment).toBeTruthy();
      expect(comment.content).not.toEqual(oldComment.content);
      expect(comment.content).toEqual(contentUpdate);
    });
  });
});
