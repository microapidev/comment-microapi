const app = require("../../../../server");
const supertest = require("supertest");
const request = supertest(app);
const ApplicationModel = require("../../../../models/applications");
const OrganizationModel = require("../../../../models/organizations");

describe("Block an Application ", () => {
  it("Should block an Application ", async () => {
    //create mock organiztion
    const rand = Math.floor(Math.random() * 1000 + 1);
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

    //block it
    const url = `/v1/msadmins/applications/${application._id}/block`;
    const bearerToken = `bearer ${global.sysToken}`;
    const res = await request.patch(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
  });

  it("Should return a 401 error if Authentication fails", async () => {
    const url = `/v1/msadmins/applications/${global.application._id}/block`;
    const bearerToken = `bearer ${global}`; //an invalid token
    const res = await request.patch(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("Should return a 404 error if application is not found", async () => {
    const url = `/v1/msadmins/Applications/5f08a075b9319514ecc35546/block`;
    const bearerToken = `bearer ${global.sysToken}`; //an invalid token
    const res = await request.patch(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
