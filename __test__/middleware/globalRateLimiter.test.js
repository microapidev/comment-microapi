const express = require("express");
const globalRateLimiter = require("../../middleware/globalRateLimiter");
const supertest = require("supertest");

describe("Global rate limiter", () => {
  let app, request;
  process.env.maxRequestsPerMin = 50;

  beforeEach(() => {
    app = express();
    app.use(globalRateLimiter);
    app.get("/", (req, res) => {
      res.status(200).send("OK");
    });

    request = supertest(app);
  });

  it("should allow requests below global limit", async () => {
    //make 40 requests
    for (let index = 1; index < 40; index++) {
      let res = await request.get("/");
      expect(res.status).toEqual(200);
    }
  });
  it("should block requests above global limit", async () => {
    //make 60 requests
    for (let index = 1; index < 60; index++) {
      let res = await request.get("/");
      if (index > process.env.maxRequestsPerMin) {
        expect(res.status).toEqual(429);
        break;
      }
    }
  });
});
