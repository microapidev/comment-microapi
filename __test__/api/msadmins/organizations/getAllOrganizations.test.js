const app = require("../../../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("GET All organizations", () => {
  it("Should get all organizations using the microservice", async () => {
    const url = `/v1/msadmins/organizations`;
    const bearerToken = `bearer ${global.sysToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
  });

  it("Should return a 401 error if Authentication fails", async () => {
    const url = `/v1/msadmins/organizations`;
    const bearerToken = `bearer ${global}`; //an invalid token
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
