const app = require("../../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("Get logged in microservice admin's details GET /msadmins/me", () => {
  it("Should get a single microservice admin", async () => {
    const url = `/v1/msadmins/me`;
    const bearerToken = `bearer ${global.sysToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.fullname).toEqual(global.msAdmin.fullname);
    expect(res.body.data.email).toEqual(global.msAdmin.email);
  });

  it("Should return a 401 error if Authentication fails", async () => {
    const url = `/v1/msadmins/me`;
    const bearerToken = `bearer ${global}`; //an invalid token
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
