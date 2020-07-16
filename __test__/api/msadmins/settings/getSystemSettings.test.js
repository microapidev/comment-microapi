const app = require("../../../../server");
const supertest = require("supertest");
const SystemSettings = require("../../../../models/systemSettings");
const request = supertest(app);

describe("GET /msAdmins/settings", () => {
  it("Should get all system settings", async () => {
    //get system settings from DB
    const settings = await SystemSettings.findOne({});
    let res = await request
      .get(`/v1/msAdmins/settings`)
      .set("Authorization", `bearer ${global.superSysToken}`);

    expect(res.status).toEqual(200);
    expect(settings).toEqual(expect.objectContaining(res.body.data));
  });

  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/msAdmins/settings`;
    const bearerToken = `bearer `;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("Should return a 401 error when admin token is unauthorized", async () => {
    const url = `/v1/msAdmins/settings`;
    const bearerToken = `bearer ${global.sysToken}`;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
});
