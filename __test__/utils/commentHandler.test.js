const commentHandler = require("../../utils/commentHandler");
const CommentModel = require("../../models/comments");

describe("Unit test for commentHandler function", () => {
  const mockComment = new CommentModel({
    refId: "4edd40c86762e0fb12000003",
    applicationId: global.application._id,
    content: "A mock comment from user1",
    ownerId: "user1@email.com",
    origin: "b12000003",
  });

  test("Should match expected object", () => {
    const expected = {
      commentId: mockComment.id,
      refId: mockComment.refId,
      applicationId: mockComment.applicationId,
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
