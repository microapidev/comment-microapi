const app = require("../../../../server");
const supertest = require("supertest");
const request = supertest(app);
const softDelete = require("../../../../utils/softDelete");
const OrganizationModel = require("../../../../models/organizations");

describe("unblock an Organization ", () => {
  it("Should unblock organizations ", async () => {
    //create sample org
    const rand = Math.floor(Math.random() * 100 + 1);
    const organization = await new OrganizationModel({
      name: "hng",
      email: `newOrg${rand}${Date.now()}@email.com`,
      secret: "hithere",
    });
    await organization.save();

    //block it
    await softDelete.deleteById(
      OrganizationModel,
      organization._id,
      global.msSuperAdmin._id
    );

    //unblock organization using softDelete
    const url = `/v1/msadmins/organizations/${organization._id}/unblock`;
    const bearerToken = `bearer ${global.sysToken}`;
    const res = await request.patch(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
  });

  it("Should return a 401 error if Authentication fails", async () => {
    const url = `/v1/msadmins/organizations/${global.organization._id}/unblock`;
    const bearerToken = `bearer ${global}`; //an invalid token
    const res = await request.patch(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("Should return a 404 error if Organization is not found", async () => {
    //create sample org
    const rand = Math.floor(Math.random() * 100 + 1);
    const organization = await new OrganizationModel({
      name: "hng",
      email: `newOrg${rand}${Date.now()}@email.com`,
      secret: "hithere",
    });
    await organization.save();

    //block it
    await softDelete.deleteById(
      OrganizationModel,
      organization._id,
      global.msSuperAdmin._id
    );

    const url = `/v1/msadmins/organizations/5f08a075b9319514ecc35546/unblock`;
    const bearerToken = `bearer ${global.sysToken}`; //an invalid token
    const res = await request.patch(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
