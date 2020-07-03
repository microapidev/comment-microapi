const app = require("../../server");
const request = require("supertest");

describe("GET /v1", () => {
  test("Should return status 200 and render Swagger docs", async () => {
    const res = await request(app).get("/v1");
    expect(res.status).toBe(301);
    expect(res.text).toMatchSnapshot();
  });
});

describe("ALL '/xyz' - Invalid routes", () => {
  test("Requests should return status 404 and error message", async () => {
    const res = await request(app).post("/xyz");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Oops. The route POST /xyz is not recognised");
  });
});
