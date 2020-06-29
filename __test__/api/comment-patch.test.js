const app = require("../../server");
const CommentModel = require("../../models/comments");
// const ReplyModel = require("../../models/replies");
const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../helpers/conditionalTests");

describeIfEndpoint(
    "PATCH",
    "/comments/:commentId",
    "PATCH /comments/:commentId",
    () => {
      it("Updates a comment", async () => {
        const comment = new CommentModel({
          commentBody: "this is a comment",
          commentOwnerName: "userName",
          commentOwnerEmail: "useremail@email.com",
          commentOrigin: "123123",
          commentOwner: mongoose.Types.ObjectId(),
        });
        await comment.save();
  
        const commentId = comment._id;
  
        const res = await request.patch(`/comments/${commentId}`).send({commentOwnerEmail: comment.commentOwnerEmail,commentBody:"New Comment Update"});
  
        
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.data.commentBody).toBeTruthy();      
        expect(res.body.data.commentOwnerEmail).toBeTruthy();
      });
    }
  );
  