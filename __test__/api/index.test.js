const app = require("../../server");
const mongoose = require("mongoose");
const supertest = require("supertest");
const request = supertest(app);

describe("GET /", () => {
  test("Should return status 200 and render Swagger docs", async (done)=> {
    const res = await request.get("/");
    expect(res.status).toBe(200);
    expect(res.text).toMatchSnapshot();
    done();
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await mongoose.disconnect();
  });
});

describe("Invalid routes '/xyz'", () => {
  test("Requests should return status 404 and error message", async (done) => {
    const res = await request.post("/xyz");
    expect(res.status).toBe(404);
    expect({
      message: `Oops. The route ${res.method} ${res.originalUrl} is not recognised.`,
    });
    done();
  });
});
