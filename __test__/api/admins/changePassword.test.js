const app = require("../../../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const AdminModel = require("../../../models/admins");
const { getOrgToken } = require("../../../utils/auth/tokenGenerator");
const { comparePassword } = require("../../../utils/auth/passwordUtils");

const request = supertest(app);

describe("PATCH /v1/admins/:adminId/change-password", () => {
  let passwordChangeInfo = {
    oldPassword: "password",
    newPassword: "passcode",
  };
  let url = `/v1/admins/change-password`;

  let orgToken;

  beforeAll(async () => {
    orgToken = await getOrgToken(global.organization._id, global.admin._id);
  });

  it("updates admin password", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${orgToken}`)
      .send(passwordChangeInfo);
    expect(res.status).toEqual(201);
    expect(res.body.message).toBeTruthy();

    const Admin = await AdminModel.findById(global.admin._id);
    const hasChanged = await comparePassword(
      passwordChangeInfo.newPassword,
      Admin.password
    );
    expect(hasChanged).toBe(true);
  });

  it("returns 400 when old password is wrong", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${orgToken}`)
      .send({ oldPassword: "lol wut wrong!", ...passwordChangeInfo });
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
      .post(url)
      .set("Authorization", `bearer ${token}`)
      .send(passwordChangeInfo);
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("returns validation error on invalid inputs", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${orgToken}`);
    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
