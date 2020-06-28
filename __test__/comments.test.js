const app = require("../server");
// const Comments = require("../models/comments");
const supertest = require("supertest");
const request = supertest(app);
import { skipIfNotFound } from "./helpers/conditionalTests";

describe("GET Comments Endpoints", () => {
  skipIfNotFound("/comments", "GET");
  it("gets all comments from the db", async () => {
    const res = await request.get("/comments");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Comments Retrieved Successfully");
  });

  it("gets all comment for a particular ref", async () => {
    const refId = request.params.refId;
    const res = await request.get("/comments/refs/" + refId);
    expect(request.body).toHaveProperty("refId");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.refId).toBe("refId");
  });

  it("gets all replies for a comment", async () => {
    const commentId = request.params.commentId;
    const res = await request.get("/comments/replies/" + commentId);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.commentId).toBe(commentId);
  });
});
