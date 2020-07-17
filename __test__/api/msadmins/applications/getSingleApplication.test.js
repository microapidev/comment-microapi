const app = require("../../../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("GET Single Application", () => {
  it("Should get an application using the microservice", async () => {
    const url = `/v1/msadmins/applications/${global.application._id}`;
    const bearerToken = `bearer ${global.superSysToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.applicationName).toEqual(global.application.name);
    expect(res.body.data.applicationId).toEqual(String(global.application._id));
    expect(res.body.data.organizationId._id).toEqual(
      String(global.application.organizationId)
    );
  });

  it("Should return a 401 error if Authentication fails", async () => {
    const url = `/v1/msadmins/applications/${global.application._id}`;
    const bearerToken = `bearer ${global}`; //an invalid token
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("Should return a 404 error if Applciation is not found", async () => {
    const url = `/v1/msadmins/applications/5f08a075b9319514ecc35280`;
    const bearerToken = `bearer ${global.superSysToken}`; //an invalid token
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
