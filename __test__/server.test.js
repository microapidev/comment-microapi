import app from "../server";
const request = require("supertest");

describe("Dummy Test", () => {
  it("should respond with status code 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
