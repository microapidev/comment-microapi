const { truncate } = require("./config/db");
const CommentModel = require("../models/comments");
const mongoose = require("mongoose");

describe("INSERT", () => {
  beforeEach(async () => {
    truncate(CommentModel);
  });

  test("Should confirm jest-mongodb works by adding a record", async () => {
    const id = mongoose.Types.ObjectId();
    const mockComment = new CommentModel({
      _id: id,
      commentBody: "this is a comment",
      commentOwnerName: "userName",
      commentOwnerEmail: "useremail@email.com",
      commentOrigin: "123123",
      commentOwner: mongoose.Types.ObjectId(),
    });
    await mockComment.save();

    const insertedComment = await CommentModel.findById(id);
    expect(insertedComment._id).toEqual(mockComment._id);
    expect(insertedComment.commentOwnerEmail).toEqual(
      mockComment.commentOwnerEmail
    );
  });
});
