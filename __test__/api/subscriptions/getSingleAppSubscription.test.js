const app = require("../../../server");
const mongoose = require("mongoose");
const supertest = require("supertest");
const ApplicationModel = require("../../../models/applications");
const SubscriptionModel = require("../../../models/subscriptions");
const request = supertest(app);

// Cached application and subscription
let application, subscription;

describe("get /applications/:applicationId/subscriptions", () => {
  beforeEach(async () => {
    // Mock an application document.
    const mockedApplicationDoc = new ApplicationModel({
      name: "App",
      organizationId: global.organization._id,
      createdBy: global.admin._id,
    });

    // Save mocked application document to the database and cache it.
    application = await mockedApplicationDoc.save();

    //calculate subscription expiry date
    const subscriptionDate = new Date();
    const expireOn = new Date();
    const period = "monthly";
    let expiryDate = new Date(
      expireOn.setMonth(subscriptionDate.getMonth() + 1)
    );

    //populate subscriptionData
    const subscriptionData = {
      applicationId: application._id,
      planId: mongoose.Types.ObjectId(),
      period: period.toLowerCase(),
      expiresOn: expiryDate,
      subscribedOn: subscriptionDate,
    };

    subscription = new SubscriptionModel(subscriptionData);
    await subscription.save();
  });

  afterEach(async () => {
    // Delete mock from the database.
    await ApplicationModel.findByIdAndDelete(application._id);
    await SubscriptionModel.findByIdAndDelete(subscription._id);

    // Delete cache.
    application = null;
    subscription = null;
  });

  it("should get application subscription", async () => {
    const url = `/v1/applications/${application._id}/subscriptions`;
    const bearerToken = `bearer ${global.orgToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.applicationId).toEqual(
      String(subscription.applicationId)
    );
    expect(res.body.data.subscriptionId).toEqual(String(subscription._id));
    expect(res.body.data.period).toEqual(subscription.period);
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
