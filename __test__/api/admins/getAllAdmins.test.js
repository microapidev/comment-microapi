const app = require("../../../server");
const supertest = require("supertest");
const Admin = require("../../../models/admins");
const request = supertest(app);

// Cached admin.
let admin;

describe("GET /admins", () => {
  beforeEach(async () => {
    // Mock an admin document.
    admin = new Admin({
      fullname: "IAmAdmin",
      email: "iamadmin@email.org",
      password: "let me in please",
      organizationId: global.organization._id,
    });

    // Save mocked admin document to the database and cache it.
    await admin.save();
  });

  afterEach(async () => {
    // Delete mock from the database.
    await Admin.findByIdAndDelete(admin._id);

    // Delete cache.
    admin = null;
  });

  it("Should get all admins", async () => {
    let res = await request
      .get(`/v1/admins`)
      .set("Authorization", `bearer ${global.orgToken}`);

    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        {
          adminId: global.admin.id,
          fullname: global.admin.fullname,
          email: global.admin.email,
        },
        {
          adminId: admin.id,
          fullname: admin.fullname,
          email: admin.email,
        },
      ])
    );
  });

  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/admins`;
    const bearerToken = `bearer `;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
});
