const app = require("../../../../server");
const supertest = require("supertest");
const SystemSettings = require("../../../../models/systemSettings");
const request = supertest(app);

describe("PATCH /msAdmins/settings", () => {
  it("Should insert/update system settings", async () => {
    //system settings from DB should be empty
    const oldSettings = await SystemSettings.findOne({});
    expect(oldSettings).toBeNull();

    const initSettings = {
      maxRequestsPerMin: 100,
      defaultItemsPerPage: 30,
    };

    const expectedSettings = {
      maxRequestsPerMin: 100,
      defaultItemsPerPage: 30,
      maxItemsPerPage: 50,
    };

    let res = await request
      .patch(`/v1/msAdmins/settings`)
      .set("Authorization", `bearer ${global.superSysToken}`)
      .send(initSettings);

    expect(res.status).toEqual(200);
    expect(expectedSettings).toMatchObject(res.body.data);

    //expect new settings to be inserted in DB
    const newDBSettings = await SystemSettings.findOne({});
    expect(newDBSettings).toEqual(expect.objectContaining(res.body.data));

    const updateSettings = {
      maxRequestsPerMin: 200,
      maxItemsPerPage: 20,
    };

    const expectedUpdateSettings = {
      maxRequestsPerMin: 200,
      defaultItemsPerPage: 30,
      maxItemsPerPage: 20,
    };

    //check for update also in same process because this is a single document collection
    res = await request
      .patch(`/v1/msAdmins/settings`)
      .set("Authorization", `bearer ${global.superSysToken}`)
      .send(updateSettings);

    const updatedDBSettings = await SystemSettings.findOne({});

    expect(res.status).toEqual(200);
    expect(expectedUpdateSettings).toMatchObject(res.body.data);

    //expect new settings to be inserted in DB

    expect(updatedDBSettings).toEqual(expect.objectContaining(res.body.data));
  });

  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/msAdmins/settings`;
    const bearerToken = `bearer `;
    const initSettings = {
      maxRequestsPerMin: 100,
      defaultItemsPerPage: 30,
    };

    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send(initSettings);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("Should return a 401 error when admin token is unauthorized", async () => {
    const url = `/v1/msAdmins/settings`;
    const bearerToken = `bearer ${global.sysToken}`;
    const initSettings = {
      maxRequestsPerMin: 100,
      defaultItemsPerPage: 30,
    };

    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send(initSettings);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("Should return a 422 error when invalid settings are used", async () => {
    const url = `/v1/msAdmins/settings`;
    const bearerToken = `bearer ${global.superSysToken}`;
    const initSettings = {
      maxRequestsPerMin: 100,
      invalidItemsPerPage: 30,
    };

    const res = await request
      .patch(url)
      .set("Authorization", bearerToken)
      .send(initSettings);

    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
  });
});
