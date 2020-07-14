const app = require("../../../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const OrganizationModel = require("../../../models/organizations");
const request = supertest(app);

describe("Delete /organizations/:organizationId", () => {
  let organization;
  beforeEach(async () => {
    organization = new OrganizationModel({
        organizationName: 'HNG SDK',
        organizationEmail: `org@hngi7.com`,
        secret: 'shhhh!',
        adminName: 'ORG_MANAGER',
        adminEmail: `org@comments.com`,
        adminPassword: 'thisisapassword',
    });
    await organization.save();
  });

  afterEach(async () => {
    await OrganizationModel.findByIdAndDelete(organization._id);
    organization = null;
  });

  it("Deletes organization with provided ID", async () => {
    let res = await request
      .delete(`/v1/organization/${organization._id}`);
    expect(res.status).toEqual(200);
    expect(res.body.data.organizationId).toEqual(String(organization._id));
  });

  it("returns 404 for organization not found", async () => {
    let wrongId = mongoose.Types.ObjectId();
    let res = await request
      .delete(`/v1/organization/${wrongId}`);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
  });
});
