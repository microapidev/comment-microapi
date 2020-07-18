const app = require("../../../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("GET Single organization", () => {
  it("Should get an organization using the microservice", async () => {
    const url = `/v1/msadmins/organizations/${global.organization._id}`;
    const bearerToken = `bearer ${global.sysToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.organizationName).toEqual(global.organization.name);
    expect(res.body.data.organizationId).toEqual(
      String(global.organization._id)
    );
  });

  it("Should return a 401 error if Authentication fails", async () => {
    const url = `/v1/msadmins/organizations/${global.organization._id}`;
    const bearerToken = `bearer ${global}`; //an invalid token
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("Should return a 404 error if Applciation is not found", async () => {
    const url = `/v1/msadmins/organizations/5f08a075b9319514ecc35280`;
    const bearerToken = `bearer ${global.sysToken}`; //an invalid token
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
