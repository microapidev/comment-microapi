const app = require("../../../server");
const CommentModel = require("../../../models/comments");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);

let comment;
let allVotes;
describe("Should return a vote to a comment", () => {
  beforeEach(async () => {
    const mockComment = new CommentModel({
      content: "this is a comment",
      ownerId: "useremail@email.com",
      origin: "123123",
      applicationId: global.application._id,
      upVotes: [],
      downVotes: [],
    });
    mockComment.upVotes.push(mockComment.ownerId);
    mockComment.downVotes.push("downvotinguser@gmail.com");
    allVotes = mockComment.upVotes.concat(mockComment.downVotes);
    //save mock comment to the db
    comment = await mockComment.save();
  });

  afterEach(async () => {
    //delete mocks from the db
    await CommentModel.findByIdAndDelete(comment.id);

    //delete cache
    comment = null;
  });
  it("given an invalid comment id", async () => {
    const url = `/v1/comments/5sfd3323434r/votes`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllVotesRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    return getAllVotesRequest.then((res) => {
      expect(res.status).toEqual(404);
      expect(res.body.status).toEqual("error");
      expect(res.body.data).toEqual([]);
    });
  });
  it("given a valid comment ID but an unauthorized bearer token", async () => {
    const url = `/v1/comments/${comment.id}/votes`;
    const bearerToken = `bearer`;

    const getAllVotesRequest = request
      .get(url)
      .set("Authorization", bearerToken);
    return getAllVotesRequest.then((res) => {
      expect(res.status).toEqual(401);
      expect(res.body.status).toEqual("error");
      expect(res.body.data).toEqual([]);
    });
  });
  it("given an valid comment id and auth token without votetype query", async () => {
    const url = `/v1/comments/${comment.id}/votes`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllVotesRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    return getAllVotesRequest.then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(String(comment._id));
      expect(res.body.data.votes).toEqual(allVotes);
    });
  });
  it("given an valid comment id and auth token with upVotes query", async () => {
    const url = `/v1/comments/${comment.id}/votes?voteType=upvote`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllVotesRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    return getAllVotesRequest.then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(String(comment._id));
      expect(res.body.data.votes[0]).toEqual(comment.upVotes[0]);
    });
  });
  it("given an valid comment id and auth token with downVote query", async () => {
    const url = `/v1/comments/${comment.id}/votes?voteType=downvote`;
    const bearerToken = `bearer ${global.appToken}`;

    const getAllVotesRequest = request
      .get(url)
      .set("Authorization", bearerToken);

    return getAllVotesRequest.then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.data.commentId).toEqual(String(comment._id));
      expect(res.body.data.votes[0]).toEqual(comment.downVotes[0]);
    });
  });
});
