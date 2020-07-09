const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const commentHandler = require("../../../utils/commentHandler");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);

let oldComment, oldCommentWithUpVote, oldCommentWithDownVote;

describe("PATCH /comments/:commentId/votes/upvote", () => {
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

    // Mock a comment document.
    const mockedOldCommentWithUpVoteDoc = new CommentModel({
      content: "A comment from user 2",
      ownerId: "user2@email.com",
      origin: "135135",
      refId: 1,
      applicationId: global.application._id,
      flags: ["flagger@gmail.com"],
      upVotes: ["voter@gmail.com"],
    });

    // Mock a comment document.
    const mockedOldCommentWithDownVoteDoc = new CommentModel({
      content: "A comment from user 3",
      ownerId: "user3@email.com",
      origin: "135135",
      refId: 1,
      applicationId: global.application._id,
      flags: ["flagger@gmail.com"],
      downVotes: ["voter@gmail.com"],
    });

    // Save mocked comment document to the database.
    const savedOldComment = await mockedOldCommentDoc.save();
    const savedOldCommentWithUpVote = await mockedOldCommentWithUpVoteDoc.save();
    const savedOldCommentWithDownVote = await mockedOldCommentWithDownVoteDoc.save();

    // Cache response objects
    oldComment = commentHandler(savedOldComment);
    oldCommentWithUpVote = commentHandler(savedOldCommentWithUpVote);
    oldCommentWithDownVote = commentHandler(savedOldCommentWithDownVote);
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(oldComment.commentId);
    await CommentModel.findByIdAndDelete(oldCommentWithDownVote.commentId);

    // Delete cache.
    oldComment = null;
    oldCommentWithDownVote = null;
  });

  it("Should add a upvote (new vote) to a comment ", async () => {
    const url = `/v1/comments/${oldComment.commentId}/votes/upvote`;
    const bearerToken = `bearer ${global.appToken}`;
    const ownerIdUpdate = "voter@gmail.com";

    // Run test matchers to verify that the comment votes have not been updated in the database.
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
  });

  it("Should add a upvote (downvote exists) to a comment (toggle)", async () => {
    const url = `/v1/comments/${oldCommentWithDownVote.commentId}/votes/downvote`;
    const bearerToken = `bearer ${global.appToken}`;
    const ownerIdUpdate = "voter@gmail.com";

    // Run test matchers to verify that the comment votes have not been updated in the database.
    await CommentModel.findById(oldCommentWithDownVote.commentId).then(
      (comment) => {
        expect(comment).toBeTruthy();
        expect(comment.upVotes.length).toEqual(
          oldCommentWithDownVote.numOfUpVotes
        );
        expect(comment.downVotes.length).toEqual(
          oldCommentWithDownVote.numOfDownVotes
        );
        expect(comment.downVotes.length + comment.upVotes.length).toEqual(
          oldCommentWithDownVote.numOfVotes
        );
      }
    );

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
      commentId: oldCommentWithDownVote.commentId,
      numOfVotes: oldCommentWithDownVote.numOfVotes,
      numOfUpVotes: oldCommentWithDownVote.numOfUpVotes - 1,
      numOfDownVotes: oldCommentWithDownVote.numOfDownVotes + 1,
    });

    // Run test matchers to verify that the comment votes have been added in the database.
    await CommentModel.findById(oldCommentWithDownVote.commentId).then(
      (comment) => {
        expect(comment).toBeTruthy();
        expect(comment.upVotes.length).toEqual(
          oldCommentWithDownVote.numOfUpVotes - 1
        );
        expect(comment.downVotes.length).toEqual(
          oldCommentWithDownVote.numOfDownVotes + 1
        );
        expect(comment.downVotes.length + comment.upVotes.length).toEqual(
          oldCommentWithDownVote.numOfVotes
        );
      }
    );
  });

  it("Should remove a upvote from a comment ", async () => {
    const url = `/v1/comments/${oldCommentWithUpVote.commentId}/votes/downvote`;
    const bearerToken = `bearer ${global.appToken}`;
    const ownerIdUpdate = "voter@gmail.com";

    // Run test matchers to verify that the comment votes have not been removed in the database.
    await CommentModel.findById(oldCommentWithUpVote.commentId).then(
      (comment) => {
        expect(comment).toBeTruthy();
        expect(comment.upVotes.length).toEqual(
          oldCommentWithUpVote.numOfUpVotes
        );
        expect(comment.downVotes.length).toEqual(
          oldCommentWithUpVote.numOfDownVotes
        );
        expect(comment.downVotes.length + comment.upVotes.length).toEqual(
          oldCommentWithUpVote.numOfVotes
        );
      }
    );

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
      commentId: oldCommentWithUpVote.commentId,
      numOfVotes: oldCommentWithUpVote.numOfVotes - 1,
      numOfUpVotes: oldCommentWithUpVote.numOfUpVotes,
      numOfDownVotes: oldCommentWithUpVote.numOfDownVotes - 1,
    });

    // Run test matchers to verify that the comment vote has been removed in the database.
    await CommentModel.findById(oldCommentWithUpVote.commentId).then(
      (comment) => {
        expect(comment).toBeTruthy();
        expect(comment.upVotes.length).toEqual(
          oldCommentWithUpVote.numOfUpVotes
        );
        expect(comment.downVotes.length).toEqual(
          oldCommentWithUpVote.numOfDownVotes - 1
        );
        expect(comment.downVotes.length + comment.upVotes.length).toEqual(
          oldCommentWithUpVote.numOfVotes - 1
        );
      }
    );
  });
});
