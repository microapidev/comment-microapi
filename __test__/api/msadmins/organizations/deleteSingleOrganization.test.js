const app = require("../../../../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const OrganizationModel = require("../../../../models/organizations");
const request = supertest(app);

describe("Delete /organizations/:organizationId", () => {
  it("Deletes organization with provided ID", async () => {
    const rand = Math.floor(Math.random() * 100 + 1);
    const organization = await new OrganizationModel({
      name: "hng",
      email: `new${rand}@email.com`,
      secret: "hithere",
    });
    await organization.save();
    const bearerToken = `bearer ${global.superSysToken}`;
    let res = await request
      .delete(`/v1/msadmins/organizations/${organization._id}`)
      .set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.data.organizationId).toEqual(String(organization._id));
  });

  it("returns 404 for organization not found", async () => {
    let wrongId = mongoose.Types.ObjectId();
    const bearerToken = `bearer ${global.superSysToken}`;
    let res = await request
      .delete(`/v1/msadmins/organizations/${wrongId}`)
      .set("Authorization", bearerToken);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
  });
});
