const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);

describe("GET /", () => {
  test("GET request to / endpoint", async (done) => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Welcome");
    expect(response.body.data).toBe("This is the comments service api");
    done();
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 2000));
    await mongoose.disconnect();
  });
});
