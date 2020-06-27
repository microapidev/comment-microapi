import app from "../server";
const request = require("supertest");

describe("Dummy Test", () => {
  jest.setTimeout(15000);
  it("it should pass", async () => {
    expect(true).toBe(true);
  });
  it("should respond with status code 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
