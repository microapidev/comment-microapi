import app from "../server";
const request = require("supertest");
const mongoose = require("mongoose");

describe("Dummy Test", () => {
  jest.setTimeout(15000);
  it("it should pass", async () => {
    expect(true).toBe(true);
  });
  it("should respond with status code 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 8000));
    await mongoose.disconnect();
  });
});
