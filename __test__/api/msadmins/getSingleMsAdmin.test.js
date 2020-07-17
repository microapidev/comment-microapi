const app = require("../../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("Get a single microservice Admin", () => {
  it("Should get a single microservice admin", async () => {
    const url = `/v1/msadmins/${global.msAdmin.id}`;
    const bearerToken = `bearer ${global.superSysToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.fullname).toEqual(global.msAdmin.fullname);
    expect(res.body.data.email).toEqual(global.msAdmin.email);
  });

  it("Should return a 401 error if Authentication fails", async () => {
    const url = `/v1/msadmins/${global.msAdmin.id}`;
    const bearerToken = `bearer ${global}`; //an invalid token
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("Should return a 404 error if admin is not found", async () => {
    const url = `/v1/msadmins/5f08a075b9319514ecc35280`; //id non-existent
    const bearerToken = `bearer ${global.superSysToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("Should return a 422 error if validation fails", async () => {
    const url = `/v1/msadmins/345df`; //wrong id
    const bearerToken = `bearer ${global.superSysToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
