const app = require("../../../server");
const OrganizationModel = require("../../../models/organizations");
const AdminModel = require("../../../models/admins");
const supertest = require("supertest");
const { hashPassword } = require("../../../utils/auth/passwordUtils");
const request = supertest(app);

let organizationInfo = {
  name: "Justice League",
  email: "jladmin@hotels.ng",
  password: "jlorg2020",
};

let adminInfo = {
  fullname: "Admin",
  email: "admin@hotels.ng",
  password: "jladmin2020",
};

describe("POST /organizations/token", () => {
  let savedAdmin;
  const url = "/v1/organizations/token";
  beforeAll(async () => {
    const secret = await hashPassword(organizationInfo.password);
    const Organization = new OrganizationModel({
      ...organizationInfo,
      secret,
    });
    const password = await hashPassword(adminInfo.password);
    let savedOrganization = await Organization.save();
    const Admin = new AdminModel({
      ...adminInfo,
      password,
      organizationId: savedOrganization._id,
    });
    savedAdmin = await Admin.save();
  });

  it("Should return organization token on successful login", async () => {
    const res = await request.post(url).send({
      email: adminInfo.email,
      password: adminInfo.password,
      organizationId: savedAdmin.organizationId,
    });
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.organizationToken).toBeTruthy();
  });

  it("Should return authentication error on failed login", async () => {
    const res = await request.post(url).send({
      email: adminInfo.email,
      password: "lol wrong!",
      organizationId: savedAdmin.organizationId,
    });
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("Should return validation error on missing inputs", async () => {
    const res = await request.post(url);
    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toEqual(expect.stringContaining("input"));
  });
});
