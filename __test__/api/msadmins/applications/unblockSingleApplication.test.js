const app = require("../../../../server");
const supertest = require("supertest");
const request = supertest(app);
const softDelete = require("../../../../utils/softDelete");
const ApplicationModel = require("../../../../models/applications");
const OrganizationModel = require("../../../../models/organizations");

describe("unblock an Application ", () => {
  it("Should unblock application ", async () => {
    //create sample org
    const rand = Math.floor(Math.random() * 100 + 1);
    const organization = await new OrganizationModel({
      name: "hng",
      email: `newOrg${rand}@email.com`,
      secret: "hithere",
    });
    await organization.save();

    //create mock application
    const application = await new ApplicationModel({
      name: "hng app",
      organizationId: organization._id,
      createdBy: global.msAdmin._id,
    });
    await application.save();

    //block the application
    const blockedApp = await softDelete.deleteById(
      ApplicationModel,
      application._id,
      global.msSuperAdmin.id
    );

    //unblock Application using softDelete
    const url = `/v1/msadmins/applications/${blockedApp._id}/unblock`;
    console.log(url);
    const bearerToken = `bearer ${global.sysToken}`;
    const res = await request.patch(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
  });

  it("Should return a 401 error if Authentication fails", async () => {
    const url = `/v1/msadmins/applications/${global.application._id}/unblock`;
    const bearerToken = `bearer ${global}`; //an invalid token
    const res = await request.patch(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("Should return a 404 error if Application is not found", async () => {
    const url = `/v1/msadmins/applications/5f08a075b9319514ecc35546/unblock`;
    const bearerToken = `bearer ${global.sysToken}`; //an invalid token
    const res = await request.patch(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
