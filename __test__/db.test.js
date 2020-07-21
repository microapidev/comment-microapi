const { truncate } = require("./config/db");
const CommentModel = require("../models/comments");
const mongoose = require("mongoose");

describe("INSERT", () => {
  beforeEach(async () => {
    await truncate(CommentModel);
  });

  test("Should confirm jest-mongodb works by adding a record", async () => {
    const id = mongoose.Types.ObjectId();
    const mockComment = new CommentModel({
      _id: id,
      content: "this is a comment",
      ownerId: "useremail@email.com",
      origin: "123123",
      refId: "50",
      applicationId: mongoose.Types.ObjectId(),
    });
    await mockComment.save();

    const insertedComment = await CommentModel.findById(id);
    expect(insertedComment.id).toEqual(mockComment.id);
    expect(insertedComment.ownerId).toEqual(mockComment.ownerId);
  });
});
