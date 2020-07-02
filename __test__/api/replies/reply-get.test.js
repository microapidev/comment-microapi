const app = require("../../server");
const supertest = require("supertest");
const CommentModel = require("../../models/comments");
const mongoose = require("mongoose");
const request = supertest(app);
import { describeIfEndpoint } from "../helpers/conditionalTests";

describeIfEndpoint(
  "GET",
  "/comments/{commentId}/replies",
  "GET '/comments/{commentId}/replies'",
  () => {
    test("Should return all replies to a comment", async () => {
      const res = await request.post("/comments").send({
        content: "this is a comment",
        ownerId: "useremail@email.com",
        origin: "123123",
      });
      expect(res.status).toBe(200);
      expect(res.body.data.content).toBeTruthy();
      expect(res.body.data.ownerId).toBeTruthy();
    });
  }
);
