const app = require("../../../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const AdminModel = require("../../../models/admins");
const { getOrgToken } = require("../../../utils/auth/tokenGenerator");

const request = supertest(app);

describe("POST /v1/admins", () => {
  let adminInfo = {
    fullname: "Test Admin",
    email: "testadmin007@hotels.ng",
    password: "password",
  };
  let url = "/v1/admins";

  beforeAll(() => {
    adminInfo.organizationId = global.organization._id;
  });

  it("creates an admin", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${global.orgToken}`)
      .send(adminInfo);

    expect(res.status).toBe(201);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.adminId).toBeTruthy();

    const savedAdmin = await AdminModel.findById(res.body.data.adminId);
    expect(savedAdmin.fullname).toEqual(adminInfo.fullname);
    expect(savedAdmin.email).toEqual(adminInfo.email);
  });

  it("returns 401 for unauthorized user", async () => {
    const res = await request.post(url).send(adminInfo);

    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("returns 400 for wrong organization token", async () => {
    const token = await getOrgToken(
      global.organization._id,
      mongoose.Types.ObjectId()
    );

    const res = await request
      .post(url)
      .set("Authorization", `bearer ${token}`)
      .send(adminInfo);

    expect(res.status).toBe(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("returns 422 for invalid input", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${global.orgToken}`);

    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
