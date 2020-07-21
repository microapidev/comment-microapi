const express = require("express");
const supertest = require("supertest");
const { connect, disconnect } = require("../config/db");
const errorHandler = require("../../utils/errorhandler");

describe("Plan rate limiter", () => {
  let app, request, planRatesLimiter;
  process.env.maxRequestsPerDay = 50;

  afterAll(async () => {
    const mongoClient = await planRatesLimiter.store.getClient();
    if (mongoClient) {
      await mongoClient.close();
    }
    await disconnect();
  });

  beforeAll(async () => {
    await connect();
  });

  beforeEach(() => {
    planRatesLimiter = require("../../middleware/planRatesLimiter");

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
});