const app = require("../../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("GET All Applications subscriptions", () => {
  it("Should get all applications subscription", async () => {
    const url = `/v1/msadmins/applications/subscriptions`;
    const bearerToken = `bearer ${global.sysToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
  });

  it("Should return a 401 error if Authentication fails", async () => {
    const url = `/v1/msadmins/applications/subscriptions`;
    const bearerToken = `bearer ${global}`; //an invalid token
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
