import app from "../server";
const request = require("supertest");

describe.skip("Dummy Test", () => {
  jest.setTimeout(10000);
  it("should respond with status code 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
