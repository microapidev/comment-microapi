const app = require("../../../server");
const supertest = require("supertest");
const MsAdmin = require("../../../models/msadmins");
const request = supertest(app);

// Cached admin and allMsAdminsResponse.
let msAdmin, allMsAdminsResponse;

describe("GET /msAdmins", () => {
  beforeEach(async () => {
    // Mock an msAdmin document.
    msAdmin = new MsAdmin({
      fullname: "IAmMsAdmin",
      email: "iammsAdmin@email.org",
      password: "let me in please",
    });

    // Save mocked msAdmin document to the database and cache it.
    await msAdmin.save();

    allMsAdminsResponse = [
      {
        msAdminId: global.msSuperAdmin.id,
        fullname: global.msSuperAdmin.fullname,
        email: global.msSuperAdmin.email,
        role: global.msSuperAdmin.role,
      },
      {
        msAdminId: global.msAdmin.id,
        fullname: global.msAdmin.fullname,
        email: global.msAdmin.email,
        role: global.msAdmin.role,
      },
      {
        msAdminId: msAdmin.id,
        fullname: msAdmin.fullname,
        email: msAdmin.email,
        role: msAdmin.role,
      },
    ];
  });

  afterEach(async () => {
    // Delete mock from the database.
    await MsAdmin.findByIdAndDelete(msAdmin._id);

    // Delete cache.
    msAdmin = null;
    allMsAdminsResponse = null;
  });

  it("Should get all msAdmins", async () => {
    let res = await request
      .get(`/v1/msAdmins`)
      .set("Authorization", `bearer ${global.superSysToken}`);

    expect(res.status).toEqual(200);
    expect(res.body.data.records).toEqual(
      expect.arrayContaining(allMsAdminsResponse)
    );
  });

  it("Should get all microservice admins with set limit", () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer ${global.superSysToken}`;

    const getAllMsadminsRequest = request
      .get(url)
      .query({ limit: 1 })
      .set("Authorization", bearerToken);

    const expectedValue = [...allMsAdminsResponse.slice(0, 1)];

    return getAllMsadminsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it("Should get all microservice admins with set page", () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer ${global.superSysToken}`;

    const getAllMsadminsRequest = request
      .get(url)
      .query({ page: 1 })
      .set("Authorization", bearerToken);

    const expectedValue = [...allMsAdminsResponse];

    return getAllMsadminsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it("Should get all microservice admins with set sort type", () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer ${global.superSysToken}`;

    const getAllMsadminsRequest = request
      .get(url)
      .query({ sort: "asc" })
      .set("Authorization", bearerToken);

    const expectedValue = [...allMsAdminsResponse];

    return getAllMsadminsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it("Should get all microservice admins with all pagination params set", () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer ${global.superSysToken}`;

    const getAllMsadminsRequest = request
      .get(url)
      .query({ limit: 2, page: 1, sort: "asc" })
      .set("Authorization", bearerToken);

    const expectedValue = [...allMsAdminsResponse.slice(0, 2)];

    return getAllMsadminsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.records).toEqual(expectedValue);
    });
  });

  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer `;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });

  it("Should return a 401 error when admin token is unauthorized", async () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer ${global.sysToken}`;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
});
