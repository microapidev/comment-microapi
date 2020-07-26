const express = require("express");
const supertest = require("supertest");
const errorHandler = require("../../utils/errorhandler");
const { mongoDaysFromToday } = require("../../utils/dateTImeUtils");
const RequestLog = require("../../models/requestLogs");
const mongoose = require("mongoose");
const { logWriter, requestLogger } = require("../../middleware/requestLogger");

describe("Log Writer", () => {
  it("should write values to log in db", async () => {
    const applicationId = mongoose.Types.ObjectId();

    //call logWriter function to write to DB
    const logId = await logWriter(
      applicationId,
      "GET",
      "/endpoint/path",
      200,
      "This is the message",
      10
    );

    //check the DB log for the values
    const requestLog = await RequestLog.findById(logId);

    const expectedValue = {
      applicationId,
      requestMethod: "GET",
      endpoint: "/endpoint/path",
      responseCode: 200,
      statusMessage: "This is the message",
    };

    expect(requestLog).toEqual(expect.objectContaining(expectedValue));
    const dayDiff = Math.ceil(
      (requestLog.maxLogRetention - Date.now()) / (1000 * 24 * 60 * 60)
    );
    expect(dayDiff).toEqual(10);
  });
});

describe("Logger middleware", () => {
  let app, request;

  it("logging is system-enabled and app-enabled for all requests", async () => {
    process.env.loggingEnabled = true;
    app = express();
    app.use((req, res, next) => {
      const logging = {
        loggingEnabled: true,
        maxLogRetentionDays: 20,
        skipRanges: [400],
      };
      req.token = {};
      req.token.applicationId = mongoose.Types.ObjectId();
      req.token.logging = logging;

      next();
    });
    app.use(requestLogger);
    app.get("/logging/enabled", (req, res) => {
      res.status(200).send({
        message: "loggingEnabled",
      });
    });

    app.use((err, req, res, next) => {
      errorHandler(err, req, res, next);
    });

    // send request
    request = supertest(app);
    let res = await request.get("/logging/enabled");
    expect(res.status).toEqual(200);

    //check DB for log
    const requestLog = await RequestLog.find({ endpoint: "/logging/enabled" });
    expect(requestLog.length).toEqual(1);
  });

  it("logging is system-disabled", async () => {
    process.env.loggingEnabled = false;
    app = express();
    app.use((req, res, next) => {
      const logging = {
        loggingEnabled: true,
        maxLogRetentionDays: 20,
        skipRanges: [400],
      };
      req.token = {};
      req.token.applicationId = mongoose.Types.ObjectId();
      req.token.logging = logging;

      next();
    });
    app.use(requestLogger);
    app.get("/logging/disabled", (req, res) => {
      res.status(200).send({
        message: "loggingEnabled",
      });
    });

    app.use((err, req, res, next) => {
      errorHandler(err, req, res, next);
    });

    // send request
    request = supertest(app);
    let res = await request.get("/logging/disabled");
    expect(res.status).toEqual(200);

    //check DB for log
    const requestLog = await RequestLog.find({ endpoint: "/logging/disabled" });
    expect(requestLog.length).toEqual(0);
  });

  it("logging is not available for application", async () => {
    process.env.loggingEnabled = true;
    app = express();
    app.use((req, res, next) => {
      const logging = {};
      req.token = {};
      req.token.applicationId = mongoose.Types.ObjectId();
      req.token.logging = logging;

      next();
    });
    app.use(requestLogger);
    app.get("/logging/appDisabled", (req, res) => {
      res.status(200).send({
        message: "loggingEnabled",
      });
    });

    app.use((err, req, res, next) => {
      errorHandler(err, req, res, next);
    });

    // send request
    request = supertest(app);
    let res = await request.get("/logging/appDisabled");
    expect(res.status).toEqual(200);

    //check DB for log
    const requestLog = await RequestLog.find({
      endpoint: "/logging/appDisabled",
    });
    expect(requestLog.length).toEqual(1);
    const daysBetween = mongoDaysFromToday(requestLog[0].maxLogRetention);
    expect(daysBetween).toEqual(1);
  });

  it("logging is system-enabled and app-enabled for all requests but skipped status 400", async () => {
    process.env.loggingEnabled = true;
    app = express();
    app.use((req, res, next) => {
      const logging = {
        loggingEnabled: true,
        maxLogRetentionDays: 20,
        skipRanges: [400],
      };
      req.token = {};
      req.token.applicationId = mongoose.Types.ObjectId();
      req.token.logging = logging;

      next();
    });
    app.use(requestLogger);
    app.get("/logging/skippedstatus", (req, res) => {
      res.status(400).send({
        message: "loggingEnabled",
      });
    });

    app.get("/logging/allowedstatus", (req, res) => {
      res.status(200).send({
        message: "loggingEnabled",
      });
    });

    app.use((err, req, res, next) => {
      errorHandler(err, req, res, next);
    });

    // send request for skipped status code
    request = supertest(app);
    let res = await request.get("/logging/skippedstatus");
    expect(res.status).toEqual(400);

    // send request for allowed status code
    request = supertest(app);
    res = await request.get("/logging/allowedstatus");
    expect(res.status).toEqual(200);

    //check DB for log
    //skipped status should not be logged
    let requestLog = await RequestLog.find({
      endpoint: "/logging/skippedstatus",
    });
    expect(requestLog.length).toEqual(0);

    //allowed status should be logged
    requestLog = await RequestLog.find({
      endpoint: "/logging/allowedstatus",
    });
    expect(requestLog.length).toEqual(1);
  });

  it("logging is system-disabled when env variable is undefined", async () => {
    process.env.loggingEnabled = "";
    app = express();
    app.use((req, res, next) => {
      const logging = {
        loggingEnabled: true,
        maxLogRetentionDays: 20,
        skipRanges: [400],
      };
      req.token = {};
      req.token.applicationId = mongoose.Types.ObjectId();
      req.token.logging = logging;

      next();
    });
    app.use(requestLogger);
    app.get("/logging/undefined", (req, res) => {
      res.status(200).send({
        message: "loggingEnabled",
      });
    });

    app.use((err, req, res, next) => {
      errorHandler(err, req, res, next);
    });

    // send request
    request = supertest(app);
    let res = await request.get("/logging/undefined");
    expect(res.status).toEqual(200);

    //check DB for log
    const requestLog = await RequestLog.find({
      endpoint: "/logging/undefined",
    });
    expect(requestLog.length).toEqual(0);
  });
});
