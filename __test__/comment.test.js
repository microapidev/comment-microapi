const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");

describe("Comments API", () => {
  it("returns the get all comments from the endpoint", async (done) => {
    const res = await request
      .get("/comments/replies")
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Success");
    done();
  });
  it("returns all unflagged comments from mongoose database", async () => {
    const res = await request
      .get("/comments/unflagged")
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Success");
    expect(res.body.message).toBe("All Unflagged Comments");
  });
  it("should flag comments from the endpoint", async () => {
    const id = "5eeb43c3a75da927a0c2e6ee";
    const res = await request
      .post(`/comments/flag/${id}`)
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Success");
    expect(res.body.message).toBe("Comment Flagged");
  });
  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 6000));
    await mongoose.disconnect();
  });
});
