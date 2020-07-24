const app = require("../../../server");
const supertest = require("supertest");
const ApplicationModel = require("../../../models/applications");
const SubscriptionModel = require("../../../models/subscriptions");
const SubscriptionHistoryModel = require("../../../models/subscriptionsHistory");
const PlanModel = require("../../../models/plans");
const request = supertest(app);

// Cached application and subscription
let application, subscription, plan, subHistory;

describe("get /applications/:applicationId/subscriptions", () => {
  beforeAll(async () => {
    // Mock an application document.
    const mockedApplicationDoc = new ApplicationModel({
      name: "App",
      organizationId: global.organization._id,
      createdBy: global.admin._id,
    });

    // Save mocked application document to the database and cache it.
    application = await mockedApplicationDoc.save();

    //create a mock plan
    const mockPlan = new PlanModel({
      name: "Basic",
      logging: true,
      maxLogRetentionPeriod: 10,
      maxRequestPerMin: 100,
      maxRequestPerDay: 100,
      periodWeight: 12,
    });

    //save plan doc
    plan = await mockPlan.save();

    /**
     * Subscribe application to mock plan
     */
    //calculate subscription expiry date
    const subscriptionDate = new Date();
    //calculate total period count
    const totalPeriod = parseInt(plan.periodWeight, 10) * 2;
    const expiryDate = new Date().setMonth(
      subscriptionDate.getMonth() + totalPeriod
    );

    //populate subscription History Data
    const subscriptionHistoryData = {
      applicationId: application._id,
      planId: plan._id,
      period: `${totalPeriod} months`,
      expiresOn: expiryDate,
      subscribedOn: subscriptionDate,
    };

    //save to subscription history
    subHistory = new SubscriptionHistoryModel(subscriptionHistoryData);
    await subHistory.save();
    //create subscription data & properties objects
    //logging object
    const logging = {
      value: plan.logging,
      maxLogRetentionDays: plan.maxLogRetentionPeriod,
      expiryDate,
    };

    //request per min object
    const perMinuteLimits = {
      maxRequestsPerMin: plan.maxRequestPerMin,
      expiryDate,
    };

    //request per day object
    const dailyLimits = {
      maxRequestsPerDay: plan.maxRequestPerDay,
      expiryDate,
    };
    const subDetails = {
      planName: plan.name,
      planId: plan._id,
      subscriptionHistoryId: subHistory._id,
      subscriptionStartDate: subscriptionDate,
      applicationId: application._id,
      logging: logging,
      dailyLimits: dailyLimits,
      perMinuteLimits: perMinuteLimits,
    };

    subscription = new SubscriptionModel(subDetails);
    await subscription.save();
  });

  afterAll(async () => {
    // Delete mock from the database.
    await ApplicationModel.findByIdAndDelete(application._id);
    await SubscriptionModel.findByIdAndDelete(subscription._id);
    await SubscriptionHistoryModel.findByIdAndDelete(subHistory._id);
    await PlanModel.findByIdAndDelete(plan._id);

    // Delete cache.
    application = null;
    subscription = null;
    plan = null;
    subHistory = null;
  });

  it("should get application subscription", async () => {
    // const expected = {
    //   applicationId: subscription.applicationId,
    //   planName: subscription.planName,
    //   planId: subscription.planId,
    //   subscriptionId: subscription._id,
    //   dailyLimits: subscription.dailyLimits,
    //   logging: subscription.logging,
    //   perMinuteLimits: subscription.perMinuteLimits,
    //   subscriptionHistoryId: subscription.subscriptionHistoryId,
    //   subscriptionStartDate: subscription.subscriptionStartDate,
    // };
    const url = `/v1/applications/${application._id}/subscriptions`;
    const bearerToken = `bearer ${global.orgToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toBeTruthy();
  });
  it("should return 404 if application is not found", async () => {
    const url = `/v1/applications/${global.organization._id}/subscriptions`;
    const bearerToken = `bearer ${global.orgToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/applications/${application._id}/subscriptions`;
    const bearerToken = `bearer `;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
  it("Should return a 422 error when validation fails", async () => {
    const url = `/v1/applications/543ae7d6f/subscriptions`;
    const bearerToken = `bearer ${global.orgToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
