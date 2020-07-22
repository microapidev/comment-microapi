const express = require("express");
const supertest = require("supertest");
const errorHandler = require("../../utils/errorhandler");
const planRatesLimiter = require("../../middleware/planRatesLimiter");

describe("Plan rate limiter", () => {
  let app, request;
  process.env.defaultMaxRequestsPerDay = 50;

  beforeEach(() => {
    app = express();
    app.use((req, res, next) => {
      //attach dummy token here
      req.token = {
        applicationId: global.application.id,
      };
      next();
    });
    app.use(planRatesLimiter);
    app.get("/", (req, res) => {
      res.status(200).send("OK");
    });
    app.use((err, req, res, next) => {
      errorHandler(err, req, res, next);
    });

    request = supertest(app);
  });

  it("should allow requests below plan limit", async () => {
    //make 40 requests
    for (let index = 1; index < 40; index++) {
      let res = await request.get("/");
      expect(res.status).toEqual(200);
    }
  });
  it("should block requests above plan limit", async () => {
    //make 60 requests
    for (let index = 1; index < 60; index++) {
      let res = await request.get("/");
      if (index > process.env.maxRequestsPerDay) {
        expect(res.status).toEqual(429);
        break;
      }
    }
  });
  it("should allow all requests when limits are disabled", async () => {
    process.env.disableRequestLimits = true;
    //make 100 requests
    for (let index = 0; index < 100; index++) {
      let res = await request.get("/");
      expect(res.status).toEqual(200);
    }
  });
});
