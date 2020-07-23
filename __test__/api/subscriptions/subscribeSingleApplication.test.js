const app = require("../../../server");
const supertest = require("supertest");
const ApplicationModel = require("../../../models/applications");
const PlanModel = require("../../../models/plans");
const request = supertest(app);

// Cached application.
let application, plan;

describe("POST /applications/:applicationId/subscribe/:planId", () => {
  beforeEach(async () => {
    // Mock an application document.
    const mockedApplicationDoc = new ApplicationModel({
      name: "App",
      organizationId: global.organization._id,
      createdBy: global.admin._id,
    });

    const mockPlan = new PlanModel({
      name: "Basic",
      loggingEnabled: true,
      maxLogRetentionPeriod: 10,
      requestPerMin: 100,
      maxRequestPerDay: 100,
    });

    // Save mocked application document to the database and cache it.
    application = await mockedApplicationDoc.save();
    plan = await mockPlan.save();
  });

  afterEach(async () => {
    // Delete mock from the database.
    await ApplicationModel.findByIdAndDelete(application._id);

    // Delete cache.
    application = null;
  });

  it("should subscribe an application to a plan", async () => {
    const periodData = { period: "monthly", periodCount: 3 };
    const url = `/v1/applications/${application._id}/subscribe/${plan._id}`;
    const bearerToken = `bearer ${global.orgToken}`;
    const res = await request
      .post(url)
      .set("Authorization", bearerToken)
      .send(periodData);
    expect(res.status).toEqual(201);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.applicationId).toEqual(String(application._id));
    expect(res.body.data.period).toEqual(periodData.period);
    expect(res.body.data.periodCount).toEqual(periodData.periodCount);
  });
  it("should return 404 if application is not found", async () => {
    const url = `/v1/applications/${global.organization._id}/subscribe/${plan._id}`;
    const bearerToken = `bearer ${global.orgToken}`;
    const res = await request
      .post(url)
      .set("Authorization", bearerToken)
      .send({ period: "monthly", periodCount: 3 });
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/applications/${application._id}/subscribe/${plan._id}`;
    const bearerToken = `bearer `;
    const res = await request.post(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
  it("Should return a 422 error when validation fails", async () => {
    const url = `/v1/applications/${application._id}/subscribe/5${plan._id}`;
    const bearerToken = `bearer ${global.orgToken}`;
    const res = await request.post(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("Should return a 422 error for invalid mongoId", async () => {
    const url = `/v1/applications/${application._id}/subscribe/5ea2134fac`;
    const bearerToken = `bearer ${global.orgToken}`;
    const res = await request.post(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
