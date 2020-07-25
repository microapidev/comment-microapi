const app = require("../../../server");
const supertest = require("supertest");
const ApplicationModel = require("../../../models/applications");
const PlanModel = require("../../../models/plans");
const request = supertest(app);

// Cached application.
let application, plan;

describe("POST /applications/:applicationId/subscriptions", () => {
  beforeEach(async () => {
    // Mock an application document.
    const mockedApplicationDoc = new ApplicationModel({
      name: "App",
      organizationId: global.organization._id,
      createdBy: global.admin._id,
    });

    const mockPlan = new PlanModel({
      name: "Basic",
      logging: true,
      maxLogRetentionPeriod: 10,
      maxRequestPerMin: 100,
      maxRequestPerDay: 100,
    });

    // Save mocked application document to the database and cache it.
    application = await mockedApplicationDoc.save();
    plan = await mockPlan.save();
  });

  afterEach(async () => {
    // Delete mock from the database.
    await ApplicationModel.findByIdAndDelete(application._id);
    await PlanModel.findByIdAndDelete(plan._id);

    // Delete cache.
    application = null;
    plan = null;
  });

  it("should subscribe an application to a plan", async () => {
    const data = { periodCount: 3, planId: "5f1c26d54958a7001e71e423" };
    const url = `/v1/applications/5efe228b2ea1950f68792769/subscriptions`;
    const bearerToken = `bearer ${global.orgToken}`;
    const res = await request
      .post(url)
      .set("Authorization", bearerToken)
      .send(data);
    expect(res.status).toEqual(201);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.applicationId).toEqual(String(application._id));
  });
  it("should return 404 if application is not found", async () => {
    const url = `/v1/applications/5f1a97de79287f38f4eab0be/subscriptions`;
    const bearerToken = `bearer ${global.orgToken}`;
    const res = await request
      .post(url)
      .set("Authorization", bearerToken)
      .send({ periodCount: 3, planId: plan._id });
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/applications/${application._id}/subscriptions`;
    const bearerToken = `bearer `;
    const res = await request.post(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
  it("Should return a 422 error when validation fails", async () => {
    const url = `/v1/applications/${application._id}/subscriptions`;
    const bearerToken = `bearer ${global.orgToken}`;
    const res = await request.post(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
