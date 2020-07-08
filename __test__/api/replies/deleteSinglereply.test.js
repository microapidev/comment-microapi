const app = require("../../../server");
const supertest = require("supertest");
const ReplyModel = require("../../../models/replies");
const CommentModel = require("../../../models/comments");
const commentHandler = require("../../../utils/commentHandler");
const replyHandler = require("../../../utils/replyHandler");
const request = supertest(app);

describe("DELETE /comments/:commentId/replies/:replyId", () => {
  let comment;
  let reply;

  beforeEach(async () => {
    //dummy comment document
    const dummyComment = new CommentModel({
      content: "A comment from user 1",
      ownerId: "user1@email.com",
      origin: "123123",
      refId: 2,
      applicationId: global.application._id,
    });
    //dummy replies document
    const dummyReply = new ReplyModel({
      content: "A reply from user 2",
      ownerId: "user2@email.com",
      commentId: dummyComment.id,
    });

    //save dummy comment,reply
    const savedC = await dummyComment.save();
    const savedR = await dummyReply.save();

    // Add replies to the dummy comment
    await CommentModel.findByIdAndUpdate(savedC.id, { replies: savedR.id });

    //Cache response objects
    comment = commentHandler(savedC);
    reply = replyHandler(savedR);
  });

  afterEach(async () => {
    // Delete mocks from the database.
    await CommentModel.findByIdAndDelete(comment.commentId);
    await ReplyModel.findByIdAndDelete(reply.replyId);

    // Delete cache.
    comment = null;
    reply = null;
  });

  //200 success
  test("should delete a single reply", async () => {
    const url = `/v1/comments/${comment.commentId}/replies/${reply.replyId}`;
    const bearerToken = `bearer ${global.appToken}`;
    ReplyModel.findById(reply.replyId).then((item) => {
      expect(replyHandler(item)).toMatchObject(reply);
    });

    const res = await request
      .delete(url)
      .set("Authorization", bearerToken)
      .send({
        ownerId: reply.ownerId,
      });
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toMatchObject(reply);

    //add matchers to check db that comment no longer has deleted replies
    // const comms = await CommentModel.findById(comment.commentId);
    //  expect(comms.replies).notContains(reply.replyId)

    await ReplyModel.findById(reply.replyId).then((item) => {
      expect(item).toBeNull();
    });
  });
});
