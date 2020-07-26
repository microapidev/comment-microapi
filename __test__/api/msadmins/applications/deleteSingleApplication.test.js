const app = require("../../../../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const ApplicationModel = require("../../../../models/applications");
const OrganizationModel = require("../../../../models/organizations");
const request = supertest(app);

describe("Delete /applications/:applicationId", () => {
  let organization, application;
  beforeEach(async () => {
    const rand = Math.floor(Math.random() * 100 + 1);
    organization = await new OrganizationModel({
      name: "hng",
      email: `new${rand}${Date.now()}@email.com`,
      secret: "hithere",
    });
    await organization.save();

    //create org app
    application = await new ApplicationModel({
      name: "hng app",
      organizationId: organization._id,
      createdBy: global.msAdmin._id,
    });
    await application.save();
  });
  it("Deletes application with provided ID", async () => {
    const bearerToken = `bearer ${global.sysToken}`;
    let res = await request
      .delete(`/v1/msadmins/applications/${application._id}`)
      .set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.data.applicationId).toEqual(String(application._id));
    expect(res.body.data.applicationName).toEqual(String(application.name));
  });

  it("returns 404 for application not found", async () => {
    let wrongId = mongoose.Types.ObjectId();
    const bearerToken = `bearer ${global.sysToken}`;
    let res = await request
      .delete(`/v1/msadmins/applications/${wrongId}`)
      .set("Authorization", bearerToken);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
  });

  it("returns 401 for unauthorized access", async () => {
    let wrongId = mongoose.Types.ObjectId();
    const bearerToken = `bearer ${global}`;
    let res = await request
      .delete(`/v1/msadmins/applications/${wrongId}`)
      .set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
  });
});
