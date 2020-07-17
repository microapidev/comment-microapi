const app = require("../../../server");
const supertest = require("supertest");
const { comparePassword } = require("../../../utils/auth/passwordUtils");
const MsAdminModel = require("../../../models/msadmins");

const request = supertest(app);

describe("PATCH /v1/msadmins/change-password", () => {
  let passwordChangeInfo = {
    oldPassword: "password",
    newPassword: "passcode",
  };
  let url = `/v1/msadmins/change-password`;

  it("updates admin password", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${global.sysToken}`)
      .send(passwordChangeInfo);
    expect(res.status).toEqual(200);
    expect(res.body.message).toBeTruthy();

    const msAdmin = await MsAdminModel.findById(global.msAdmin._id);

    const hasChanged = await comparePassword(
      passwordChangeInfo.newPassword,
      msAdmin.password
    );
    expect(hasChanged).toBe(true);
  });

  it("returns 400 when old password is wrong", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${global.sysToken}`)
      .send({ oldPassword: "garble garble", ...passwordChangeInfo });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("rejects invalid token", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer token`)
      .send(passwordChangeInfo);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("returns validation error on invalid inputs", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${global.sysToken}`);
    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
