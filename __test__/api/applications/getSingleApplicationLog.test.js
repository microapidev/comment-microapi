const express = require("express");
const supertest = require("supertest");
const errorHandler = require("../../../utils/errorhandler");
const RequestLog = require("../../../models/requestLogs");
const { requestLogger } = require("../../../middleware/requestLogger");
const getSingleApplicationLog = require("../../../controllers/applicationsController/getSingleApplicationLog");

describe("Get single application logs", () => {
  let app, request;

  it("should return all logs for a given application", async () => {
    process.env.LOGGING_ENABLED = true;

    //create express app
    app = express();

    // use mock applicaion
    const applicationId = global.application.id;

    // attach dummy token to request
    app.use((req, res, next) => {
      const logging = {
        loggingEnabled: true,
        maxLogRetentionDays: 20,
        skipRanges: [400],
      };
      req.token = {};
      req.token.organizationId = global.organization.id;
      req.token.applicationId = global.application.id;
      req.token.logging = logging;

      next();
    });

    //apply
    //app.use(requestLogger);

    //define dummy route and apply logger middleware
    app.get("/logging", requestLogger, (req, res) => {
      res.status(200).send({
        message: "logging request",
      });
    });

    app.get("/applications/:applicationId/logs", getSingleApplicationLog);

    app.use((err, req, res, next) => {
      errorHandler(err, req, res, next);
    });

    // send 50 requests
    request = supertest(app);

    for (let index = 0; index < 150; index++) {
      await request.get("/logging");
    }

    //check DB for log
    const requestLog = await RequestLog.find({
      endpoint: "/logging",
      applicationId,
    });
    expect(requestLog.length).toEqual(150);

    //get logs from endpoint
    const res = await request.get(`/applications/${applicationId}/logs`);

    expect(res.body.data.records.length).toEqual(100);
    expect(res.body.data.pageInfo.totalPages).toEqual(2);
  });
});
