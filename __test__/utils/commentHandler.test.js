const commentHandler = require("../../utils/commentHandler");
const { ObjectId } = require("mongoose").Types;

describe("Unit test for commentHandler function", () => {
  const mockComment = {
    replies: [],
    flags: [],
    upVotes: [],
    downVotes: [],
    _id: ObjectId("5f0504f6f7b28607cc80714f"),
    refId: "4edd40c86762e0fb12000003",
    applicationId: ObjectId("5f0504f6f7b28607cc80714a"),
    content: "A mock comment from user1",
    ownerId: "user1@email.com",
    origin: "b12000003",
    createdAt: new Date("2020-07-07T23:27:50.431Z"),
    updatedAt: new Date("2020-07-07T23:27:50.431Z"),
    __v: 0,
  };

  test("Should match expected object", () => {
    const expected = {
      commentId: String(mockComment._id),
      refId: mockComment.refId,
      applicationId: String(mockComment.applicationId),
      ownerId: mockComment.ownerId,
      content: mockComment.content,
      origin: mockComment.origin,
      numOfVotes: mockComment.upVotes.length + mockComment.downVotes.length,
      numOfUpVotes: mockComment.upVotes.length,
      numOfDownVotes: mockComment.downVotes.length,
      numOfFlags: mockComment.flags.length,
      numOfReplies: mockComment.replies.length,
    };
    expect(commentHandler(mockComment)).toMatchObject(expected);
  });
});
