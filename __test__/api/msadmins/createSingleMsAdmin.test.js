const app = require("../../../server");
const supertest = require("supertest");
const MsAdminModel = require("../../../models/msadmins");

const request = supertest(app);

describe("POST /v1/msadmins/create", () => {
  let adminInfo = {
    fullname: "Test Admin",
    email: "testadmin@hotels.ng",
    password: "password",
  };
  let admin2Info = {
    fullname: "Test Admin",
    email: "testadmin2@hotels.ng",
    password: "password",
    role: "superadmin",
  };
  let url = "/v1/msadmins/create";

  it("creates an admin with default role 'admin'", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${global.superSysToken}`)
      .send(adminInfo);

    expect(res.status).toBe(201);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.msAdminId).toBeTruthy();

    const savedAdmin = await MsAdminModel.findById(res.body.data.msAdminId);
    expect(savedAdmin.fullname).toEqual(adminInfo.fullname);
    expect(savedAdmin.role).toEqual("admin");
  });

  it("rejects request by non-super admin", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${global.sysToken}`)
      .send(adminInfo);

    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("creates an admin with default role 'superadmin'", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${global.superSysToken}`)
      .send(admin2Info);

    expect(res.status).toBe(201);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.msAdminId).toBeTruthy();

    const savedAdmin = await MsAdminModel.findById(res.body.data.msAdminId);
    expect(savedAdmin.fullname).toEqual(admin2Info.fullname);
    expect(savedAdmin.email).toEqual(admin2Info.email);
    expect(savedAdmin.role).toEqual("superadmin");
  });

  it("returns 401 for unauthorized user", async () => {
    const res = await request.post(url).send(adminInfo);

    expect(res.status).toBe(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("returns 422 for invalid input", async () => {
    const res = await request
      .post(url)
      .set("Authorization", `bearer ${global.superSysToken}`);

    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
