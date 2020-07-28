const app = require("../../../server");
const supertest = require("supertest");
const MsAdmin = require("../../../models/msadmins");
const request = supertest(app);
const { deleteById, restoreById } = require("../../../utils/softDelete");

// Cached admin and allMsAdminsResponse.
let msAdmin, msAdmin2, msAdmin3, allMsAdminsResponse;

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

    // Mock an msAdmin document.
    msAdmin2 = new MsAdmin({
      fullname: "IAmMsAdmin",
      email: "iammsAdmin2@email.org",
      password: "let me in please",
    });

    // Save mocked msAdmin document to the database and cache it.
    await msAdmin2.save();

    // Mock an msAdmin document.
    msAdmin3 = new MsAdmin({
      fullname: "IAmMsAdmin",
      email: "iammsAdmin3@email.org",
      password: "let me in please",
    });

    // Save mocked msAdmin document to the database and cache it.
    await msAdmin3.save();

    allMsAdminsResponse = [
      {
        msAdminId: msAdmin.id,
        fullname: msAdmin.fullname,
        email: msAdmin.email,
        role: msAdmin.role,
        isDisabled: false,
      },
      {
        msAdminId: msAdmin2.id,
        fullname: msAdmin2.fullname,
        email: msAdmin2.email,
        role: msAdmin2.role,
        isDisabled: false,
      },
      {
        msAdminId: msAdmin3.id,
        fullname: msAdmin3.fullname,
        email: msAdmin3.email,
        role: msAdmin3.role,
        isDisabled: false,
      },
    ];
  });

  afterEach(async () => {
    // Delete mock from the database.
    await MsAdmin.findByIdAndDelete(msAdmin._id);
    await MsAdmin.findByIdAndDelete(msAdmin2._id);
    await MsAdmin.findByIdAndDelete(msAdmin3._id);

    // Delete cache.
    msAdmin = msAdmin2 = msAdmin3 = null;
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
      .query({ limit: 3 })
      .set("Authorization", bearerToken);

    // const expectedValue = allMsAdminsResponse.slice(0, 1);

    return getAllMsadminsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.records.length).toEqual(3);
    });
  });

  it("Should get all microservice admins with set page", () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer ${global.superSysToken}`;

    const getAllMsadminsRequest = request
      .get(url)
      .query({ page: 1 })
      .set("Authorization", bearerToken);

    const expectedValue = allMsAdminsResponse;

    return getAllMsadminsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.records).toEqual(
        expect.arrayContaining(expectedValue)
      );
    });
  });

  it("Should get all microservice admins with set sort type", () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer ${global.superSysToken}`;

    const getAllMsadminsRequest = request
      .get(url)
      .query({ sort: "asc" })
      .set("Authorization", bearerToken);

    const expectedValue = allMsAdminsResponse;

    return getAllMsadminsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.records).toEqual(
        expect.arrayContaining(expectedValue)
      );
    });
  });

  it("Should get all microservice admins with all pagination params set", () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer ${global.superSysToken}`;

    const getAllMsadminsRequest = request
      .get(url)
      .query({ limit: 1, page: 1, sort: "asc" })
      .set("Authorization", bearerToken);

    // const expectedValue = allMsAdminsResponse.slice(0, 1);

    return getAllMsadminsRequest.then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.records.length).toEqual(1);
    });
  });

  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer`;

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

  it("Should get all disabled microservice admins with all pagination params set", async () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer ${global.superSysToken}`;

    //disable one admin
    await deleteById(MsAdmin, msAdmin2.id, global.msSuperAdmin.id);

    const res = await request
      .get(url)
      .query({ limit: 3, page: 1, sort: "asc", filter: "disabled" })
      .set("Authorization", bearerToken);

    // const expectedValue = allMsAdminsResponse.slice(0, 1);

    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.records.length).toEqual(1);

    await restoreById(MsAdmin, msAdmin2.Id);
  });

  it("Should get both disabled/enabled microservice admins with all pagination params set", async () => {
    const url = `/v1/msAdmins`;
    const bearerToken = `bearer ${global.superSysToken}`;

    //disable one admin
    await deleteById(MsAdmin, msAdmin2.id, global.msSuperAdmin.id);

    const res = await request
      .get(url)
      .query({ limit: 3, page: 1, sort: "asc", filter: "all" })
      .set("Authorization", bearerToken);

    // const expectedValue = allMsAdminsResponse.slice(0, 1);

    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.records.length).toEqual(3);

    await restoreById(MsAdmin, msAdmin2.Id);
  });
});
