const app = require("../../../server");
const supertest = require("supertest");
const MsAdmin = require("../../../models/msadmins");
const request = supertest(app);

// Cached admin.
let msAdmin;

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
  });

  afterEach(async () => {
    // Delete mock from the database.
    await MsAdmin.findByIdAndDelete(msAdmin._id);

    // Delete cache.
    msAdmin = null;
  });

  it("Should get all msAdmins", async () => {
    let res = await request
      .get(`/v1/msAdmins`)
      .set("Authorization", `bearer ${global.superSysToken}`);

    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
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
      ])
    );
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
