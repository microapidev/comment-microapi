const app = require("../../../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const AdminModel = require("../../../models/admins");
const { getOrgToken } = require("../../../utils/auth/tokenGenerator");
const { validateOrg } = require("../../../utils/validationRules/admins/getSingleAdminSchema");

const request = supertest(app);

describe("READ /v1/admins/get-single-admin", () => {
  let adminInfo = {
    adminId: "adminIdStr",
  };
  let url = `/v1/admins/get-single-admin`;

  it("gets single admin ", async () => {
    const res = await request
      .get(url)
      .set("Authorization", `bearer ${global.orgToken}`)
      .send(adminInfo);
    expect(res.status).toEqual(201);
    expect(res.body.message).toBeTruthy();

    const Admin = await AdminModel.findById(global.admin._id);
    const isValid = await validateOrg(
      adminInfo.adminId,
    );
    expect(isValid).toBe(true);
  });

  it("returns 400 when admin id is wrong", async () => {
    const res = await request
      .get(url)
      .set("Authorization", `bearer ${global.orgToken}`)
      .send({ adminId: " wrong!", ...adminInfo });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("reject wrong token", async () => {
    const token = await getOrgToken(
      global.organization._id,
      mongoose.Types.ObjectId()
    );
    const res = await request
      .get(url)
      .set("Authorization", `bearer ${token}`)
      .send(adminInfo);
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("returns validation error on invalid inputs", async () => {
    const res = await request
      .get(url)
      .set("Authorization", `bearer ${global.orgToken}`);
    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
