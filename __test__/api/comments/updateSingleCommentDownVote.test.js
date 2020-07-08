const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const commentHandler = require("../../../utils/commentHandler");
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
    oldComment = commentHandler(savedOldComment);
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(oldComment.commentId);

    // Delete cache.
    oldComment = null;
  });

  it("Should add or remove a downvote to a comment (toggle)", async () => {
    const url = `/v1/comments/${oldComment.commentId}/votes/downvote`;
    const bearerToken = `bearer ${global.appToken}`;
    const ownerIdUpdate = "voter@gmail.com";

    // Run test matchers to verify that the comment votes hav not been updated in the database.
    await CommentModel.findById(oldComment.commentId).then((comment) => {
      expect(comment).toBeTruthy();
      expect(comment.upVotes.length).toEqual(oldComment.numOfUpVotes);
      expect(comment.downVotes.length).toEqual(oldComment.numOfDownVotes);
      expect(comment.downVotes.length + comment.upVotes.length).toEqual(
        oldComment.numOfVotes
      );
    });

    // Run test matchers to verify that the comment votes addition produced the correct success response.
    const addRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: ownerIdUpdate,
      });

    expect(addRes.status).toEqual(200);
    expect(addRes.body.status).toEqual("success");
    expect(addRes.body.data).toEqual({
      commentId: oldComment.commentId,
      numOfVotes: oldComment.numOfVotes + 1,
      numOfUpVotes: oldComment.numOfUpVotes,
      numOfDownVotes: oldComment.numOfDownVotes + 1,
    });

    // Run test matchers to verify that the comment votes have been added in the database.
    await CommentModel.findById(oldComment.commentId).then((comment) => {
      expect(comment).toBeTruthy();
      expect(comment.upVotes.length).toEqual(oldComment.numOfUpVotes);
      expect(comment.downVotes.length).toEqual(oldComment.numOfDownVotes + 1);
      expect(comment.downVotes.length + comment.upVotes.length).toEqual(
        oldComment.numOfVotes + 1
      );
    });

    // Run test matchers to verify that the comment votes removal produced the correct success response.
    const removeRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: ownerIdUpdate,
      });

    expect(removeRes.status).toEqual(200);
    expect(removeRes.body.status).toEqual("success");
    expect(removeRes.body.data).toEqual({
      commentId: oldComment.commentId,
      numOfVotes: oldComment.numOfVotes,
      numOfUpVotes: oldComment.numOfUpVotes,
      numOfDownVotes: oldComment.numOfDownVotes,
    });

    // Run test matchers to verify that the comment vote has been removed in the database.
    await CommentModel.findById(oldComment.commentId).then((comment) => {
      expect(comment).toBeTruthy();
      expect(comment.upVotes.length).toEqual(oldComment.numOfUpVotes);
      expect(comment.downVotes.length).toEqual(oldComment.numOfDownVotes);
      expect(comment.downVotes.length + comment.upVotes.length).toEqual(
        oldComment.numOfVotes
      );
    });
  });

  it("Should return a 401 error when the authorization header's token is unauthorized", async () => {
    const url = `/v1/comments/${oldComment.commentId}/votes/downvote`;
    const bearerToken = `bearer `;

    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldComment.ownerId,
      });

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("Should return a 404 error when the commentId path parameter is invalid", async () => {
    const url = `/v1/comments/4edd30e86762e0fb12000003/votes/downvote`;
    const bearerToken = `bearer ${global.appToken}`;

    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldComment.ownerId,
        content: "content",
      });

    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("Should return a 422 error when the ownerId body property is missing or invalid", async () => {
    const url = `/v1/comments/${oldComment.commentId}/votes/downvote`;
    const bearerToken = `bearer ${global.appToken}`;

    const missingRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({});

    expect(missingRes.status).toEqual(422);
    expect(missingRes.body.status).toEqual("error");
    expect(missingRes.body.data).toBeTruthy();

    const invalidRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: 2,
      });

    expect(invalidRes.status).toEqual(422);
    expect(invalidRes.body.status).toEqual("error");
    expect(invalidRes.body.data).toBeTruthy();
  });
});
