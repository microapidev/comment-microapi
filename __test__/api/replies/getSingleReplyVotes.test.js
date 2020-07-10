const app = require("../../../server");
const CommentModel = require("../../../models/comments");
const ReplyModel = require("../../../models/replies");
const commentHandler = require("../../../utils/commentHandler");
const replyHandler = require("../../../utils/replyHandler");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);

let comment, reply1;
let allVotes;
describe("GET /comments/:commentId/replies/:replyid/votes", () => {
  beforeEach(async () => {
    // Mock a comment document
    const mockedCommentDoc = new CommentModel({
      content: "A comment from user 1",
      ownerId: "user1@email.com",
      origin: "123123",
      refId: 2,
      applicationId: global.application._id,
    });

    // Mock a reply document.
    const mockedReply1Doc = new ReplyModel({
      content: "A reply from user 2",
      ownerId: "user2@email.com",
      commentId: mockedCommentDoc.id,
    });

    // Save mocked comment document to the database and cache.
    const savedComment = await mockedCommentDoc.save();

    // Save mocked replies document to the database.
    const savedReply1 = await mockedReply1Doc.save();

    // Add replies to the mocked comment.
    await CommentModel.findByIdAndUpdate(savedComment.id, {
      $push: {
        replies: { $each: [savedReply1.id] },
      },
    });

    // Cache response objects
    comment = commentHandler(savedComment);
    reply1 = replyHandler(savedReply1);
  });

  afterEach(async () => {
    //delete mocks from the db
    await CommentModel.findByIdAndDelete(comment.commentId);
    await ReplyModel.findByIdAndDelete(reply1.replyId);

    //delete cache
    comment = null;
    reply1 = null;
  });

  it("Should get all votes of a reply", async () => {
    const url = `/v1/comments/${comment.commentId}/replies/${reply1.replyId}/votes`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllVotesRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    return getAllVotesRequest.then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(comment.commentId);
      expect(res.body.data.votes).toEqual(allVotes);
    });
  });

  it("Should get all upvotes of a reply", async () => {
    const url = `/v1/comments/${comment.commentId}/replies/${reply1.replyId}/votes?voteType=upvote`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllVotesRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    return getAllVotesRequest.then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(comment.commentId);
      expect(res.body.data.votes).toEqual(comment.upVotes);
    });
  });

  it("Should get all downvotes of a reply", async () => {
    const url = `/v1/comments/${comment.commentId}/replies/${reply1.replyId}/votes?voteType=downvote`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllVotesRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    return getAllVotesRequest.then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(comment.commentId);
      expect(res.body.data.votes).toEqual(comment.downVotes);
    });
  });

  it("Should return a 401 error when the authorization header's token is unauthorized", async () => {
    const url = `/v1/comments/${comment.commentId}/replies/${reply1.replyId}/votes`;
    const bearerToken = `bearer `;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("Should return a 404 error when the commentId path parameter is invalid", async () => {
    const invalidCommentUrl = `/v1/comments/4edd30e86762e0fb12000003/replies/${reply1.replyId}/votes`;
    const bearerToken = `bearer ${global.appToken}`;

    const invalidCommentRes = await request
      .get(invalidCommentUrl)
      .set("Authorization", bearerToken);

    expect(invalidCommentRes.status).toEqual(404);
    expect(invalidCommentRes.body.status).toEqual("error");
    expect(invalidCommentRes.body.data).toEqual([]);
  });

  it("Should return a 404 error when the replyId path parameter is invalid", async () => {
    const invalidReplyUrl = `/v1/comments/${comment.commentId}/replies/4edd30e86762e0fb12000003/votes`;
    const bearerToken = `bearer ${global.appToken}`;

    const invalidReplyRes = await request
      .patch(invalidReplyUrl)
      .set("Authorization", bearerToken);

    expect(invalidReplyRes.status).toEqual(404);
    expect(invalidReplyRes.body.status).toEqual("error");
    expect(invalidReplyRes.body.data).toEqual([]);
  });
});
