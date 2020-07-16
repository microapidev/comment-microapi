const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const ReplyModel = require("../../../models/replies");
const commentHandler = require("../../../utils/commentHandler");
const replyHandler = require("../../../utils/replyHandler");
const supertest = require("supertest");
const request = supertest(app);

/**
 * @author David Alenoghena
 * @credit to '@author of updateSingleReplyDownVotes.test.js'
 */

// Cached comment and reply responses
let oldComment, oldReply, oldReplyWithUpVote, oldReplyWithDownVote;

describe("PATCH /comments/:commentId/replies/:replyId/votes/upvote", () => {
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

    // Mock a reply document.
    const mockedOldReplyDoc = new ReplyModel({
      content: "A reply from user 2",
      ownerId: "user2@email.com",
      commentId: mockedOldCommentDoc.id,
    });

    // Mock a reply document.
    const mockedOldReplyWithUpVoteDoc = new ReplyModel({
      content: "A reply from user 3",
      ownerId: "user3@email.com",
      commentId: mockedOldCommentDoc.id,
      upVotes: ["voter@gmail.com"],
    });

    // Mock a reply document.
    const mockedOldReplyWithDownVoteDoc = new ReplyModel({
      content: "A reply from user 4",
      ownerId: "user4@email.com",
      commentId: mockedOldCommentDoc.id,
      downVotes: ["voter@gmail.com"],
    });

    // Save mocked comment document to the database.
    const savedOldComment = await mockedOldCommentDoc.save();
    const savedOldReply = await mockedOldReplyDoc.save();
    const savedOldReplyWithUpVote = await mockedOldReplyWithUpVoteDoc.save();
    const savedOldReplyWithDownVote = await mockedOldReplyWithDownVoteDoc.save();

    // Add replies to the mocked comment.
    await CommentModel.findByIdAndUpdate(savedOldComment.id, {
      $push: {
        replies: {
          $each: [
            savedOldReply.id,
            savedOldReplyWithUpVote.id,
            savedOldReplyWithDownVote.id,
          ],
        },
      },
    });

    // Cache response objects
    oldComment = commentHandler(savedOldComment);
    oldReply = replyHandler(savedOldReply);
    oldReplyWithUpVote = replyHandler(savedOldReplyWithUpVote);
    oldReplyWithDownVote = replyHandler(savedOldReplyWithDownVote);
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(oldComment.commentId);
    await ReplyModel.findByIdAndDelete(oldReply.replyId);
    await ReplyModel.findByIdAndDelete(oldReplyWithUpVote.replyId);
    await ReplyModel.findByIdAndDelete(oldReplyWithUpVote.replyId);

    // Delete cache.
    oldComment = null;
    oldReply = null;
    oldReplyWithUpVote = null;
    oldReplyWithUpVote = null;
  });

  it("Should add an upvote to a reply", async () => {
    const url = `/v1/comments/${oldComment.commentId}/replies/${oldReply.replyId}/votes/upvote`;
    const bearerToken = `bearer ${global.appToken}`;
    const ownerIdUpdate = "voter@gmail.com";

    // Run test matchers to verify that the reply votes have not been updated in the database.
    await ReplyModel.findById(oldReply.replyId).then((reply) => {
      expect(reply).toBeTruthy();
      expect(reply.upVotes.length).toEqual(oldReply.numOfUpVotes);
      expect(reply.downVotes.length).toEqual(oldReply.numOfDownVotes);
      expect(reply.downVotes.length + reply.upVotes.length).toEqual(
        oldReply.numOfVotes
      );
    });

    // Run test matchers to verify that the reply votes addition produced the correct success response.
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
      replyId: oldReply.replyId,
      content: oldReply.content,
      ownerId: oldReply.ownerId,
      numOfFlags: oldReply.numOfFlags,
      numOfVotes: oldReply.numOfVotes + 1,
      numOfUpVotes: oldReply.numOfUpVotes + 1,
      numOfDownVotes: oldReply.numOfDownVotes,
      createdAt: oldReply.createdAt,
      updatedAt: addRes.body.data.updatedAt, // hack: updated so value can't stay same
    });

    // Run test matchers to verify that the reply votes have been added in the database.
    await ReplyModel.findById(oldReply.replyId).then((reply) => {
      expect(reply).toBeTruthy();
      expect(reply.upVotes.length).toEqual(oldReply.numOfUpVotes + 1);
      expect(reply.downVotes.length).toEqual(oldReply.numOfDownVotes);
      expect(reply.downVotes.length + reply.upVotes.length).toEqual(
        oldReply.numOfVotes + 1
      );
    });
  });

  it("Should add a upvote (downvote exists) to a reply", async () => {
    const url = `/v1/comments/${oldComment.commentId}/replies/${oldReplyWithDownVote.replyId}/votes/upvote`;
    const bearerToken = `bearer ${global.appToken}`;
    const ownerIdUpdate = "voter@gmail.com";

    // Run test matchers to verify that the reply votes have not been updated in the database.
    await ReplyModel.findById(oldReplyWithDownVote.replyId).then((reply) => {
      expect(reply).toBeTruthy();
      expect(reply.upVotes.length).toEqual(oldReplyWithDownVote.numOfUpVotes);
      expect(reply.downVotes.length).toEqual(
        oldReplyWithDownVote.numOfDownVotes
      );
      expect(reply.downVotes.length + reply.upVotes.length).toEqual(
        oldReplyWithDownVote.numOfVotes
      );
    });

    // Run test matchers to verify that the reply votes addition produced the correct success response.
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
      replyId: oldReplyWithDownVote.replyId,
      content: oldReplyWithDownVote.content,
      ownerId: oldReplyWithDownVote.ownerId,
      numOfFlags: oldReplyWithDownVote.numOfFlags,
      numOfVotes: oldReplyWithDownVote.numOfVotes,
      numOfUpVotes: oldReplyWithDownVote.numOfUpVotes + 1,
      numOfDownVotes: oldReplyWithDownVote.numOfDownVotes - 1,
      createdAt: oldReplyWithDownVote.createdAt,
      updatedAt: addRes.body.data.updatedAt, // hack: updated so value can't stay same
    });

    // Run test matchers to verify that the reply votes have been added in the database.
    await ReplyModel.findById(oldReplyWithDownVote.replyId).then((reply) => {
      expect(reply).toBeTruthy();
      expect(reply.upVotes.length).toEqual(
        oldReplyWithDownVote.numOfUpVotes + 1
      );
      expect(reply.downVotes.length).toEqual(
        oldReplyWithDownVote.numOfDownVotes - 1
      );
      expect(reply.downVotes.length + reply.upVotes.length).toEqual(
        oldReplyWithDownVote.numOfVotes
      );
    });
  });

  it("Should remove an upvote from a reply", async () => {
    const url = `/v1/comments/${oldComment.commentId}/replies/${oldReplyWithUpVote.replyId}/votes/upvote`;
    const bearerToken = `bearer ${global.appToken}`;
    const ownerIdUpdate = "voter@gmail.com";

    // Run test matchers to verify that the reply votes have not been removed in the database.
    await ReplyModel.findById(oldReplyWithUpVote.replyId).then((reply) => {
      expect(reply).toBeTruthy();
      expect(reply.upVotes.length).toEqual(oldReplyWithUpVote.numOfUpVotes);
      expect(reply.downVotes.length).toEqual(oldReplyWithUpVote.numOfDownVotes);
      expect(reply.downVotes.length + reply.upVotes.length).toEqual(
        oldReplyWithUpVote.numOfVotes
      );
    });

    // Run test matchers to verify that the reply votes removal produced the correct success response.
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
      replyId: oldReplyWithUpVote.replyId,
      content: oldReplyWithUpVote.content,
      ownerId: oldReplyWithUpVote.ownerId,
      numOfFlags: oldReplyWithUpVote.numOfFlags,
      numOfVotes: oldReplyWithUpVote.numOfVotes - 1,
      numOfUpVotes: oldReplyWithUpVote.numOfUpVotes - 1,
      numOfDownVotes: oldReplyWithUpVote.numOfDownVotes,
      createdAt: oldReplyWithUpVote.createdAt,
      updatedAt: removeRes.body.data.updatedAt, // hack: updated so value can't stay same
    });

    // Run test matchers to verify that the reply vote has been removed in the database.
    await ReplyModel.findById(oldReplyWithUpVote.replyId).then((reply) => {
      expect(reply).toBeTruthy();
      expect(reply.upVotes.length).toEqual(oldReplyWithUpVote.numOfUpVotes - 1);
      expect(reply.downVotes.length).toEqual(oldReplyWithUpVote.numOfDownVotes);
      expect(reply.downVotes.length + reply.upVotes.length).toEqual(
        oldReplyWithUpVote.numOfVotes - 1
      );
    });
  });

  it("Should return a 401 error when the authorization header's token is unauthorized", async () => {
    const url = `/v1/comments/${oldComment.commentId}/replies/${oldReply.replyId}`;
    const bearerToken = `bearer `;

    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldReply.ownerId,
        content: "content",
      });

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("Should return a 404 error when the commentId or replyId path parameter is invalid", async () => {
    const invalidCommentUrl = `/v1/comments/4edd30e86762e0fb12000003/replies/${oldReply.replyId}`;
    const invalidReplyUrl = `/v1/comments/${oldComment.commentId}/replies/4edd30e86762e0fb12000003`;
    const bearerToken = `bearer ${global.appToken}`;

    const invalidCommentRes = await request
      .patch(invalidCommentUrl)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldReply.ownerId,
        content: "content",
      });

    expect(invalidCommentRes.status).toEqual(404);
    expect(invalidCommentRes.body.status).toEqual("error");
    expect(invalidCommentRes.body.data).toEqual([]);

    const invalidReplyRes = await request
      .patch(invalidReplyUrl)
      .set("Authorization", bearerToken)
      .send({
        ownerId: oldReply.ownerId,
        content: "content",
      });

    expect(invalidReplyRes.status).toEqual(404);
    expect(invalidReplyRes.body.status).toEqual("error");
    expect(invalidReplyRes.body.data).toEqual([]);
  });

  it("Should return a 422 error when the ownerId body property is missing or invalid", async () => {
    const url = `/v1/comments/${oldComment.commentId}/replies/${oldReply.replyId}`;
    const bearerToken = `bearer ${global.appToken}`;

    const missingRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        content: "content",
      });

    expect(missingRes.status).toEqual(422);
    expect(missingRes.body.status).toEqual("error");
    expect(missingRes.body.data).toBeTruthy();

    const invalidRes = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: 2,
        content: "content",
      });

    expect(invalidRes.status).toEqual(422);
    expect(invalidRes.body.status).toEqual("error");
    expect(invalidRes.body.data).toBeTruthy();
  });
});
