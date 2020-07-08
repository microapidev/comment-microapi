const app = require("../../../server");
const supertest = require("supertest");
const OrganizationModel = require("../../../models/organizations");
const request = supertest(app);

describe("POST /organization", () => {
  let organization;

  afterEach(async () => {
    await OrganizationModel.findByIdAndDelete(organization.organizationId);
    organization = null;
  });

  test("should create an organization", async () => {
    organization = {
      organizationName: "Tesla Inc",
      organizationEmail: "dev@tesla.com",
      secret: "we_love_elon_haha",
      adminName: "elon musk",
      adminEmail: "iamelon@tesla.com",
      adminPassword: "teslaspaceX123",
    };
    const res = await request.post("/v1/organizations").send(organization);

    expect(res.status).toBe(201);
    expect(res.body.status).toEqual("success");
    expect(res.body.data).toContain(
      '"organizationName" length must be at least 6 characters long in body'
    );
  });

  // 422 error, validation error
  test("should return an error when organization name is less than 6 characters long", async () => {
    organization = {
      organizationName: "Tesla",
      organizationEmail: "dev@tesla.com",
      secret: "we_love_elon_haha",
      adminName: "elon musk",
      adminEmail: "iamelon@tesla.com",
      adminPassword: "teslaspaceX123",
    };

    const res = await request.post("/v1/organizations").send(organization);

    expect(res.status).toBe(422);
    expect(res.body.data).toContain(
      '"organizationName" length must be at least 6 characters long in body'
    );
  });

  // 422 Error for missing parameters
  test("should return 422 error when organization name is missing", async () => {
    organization = {
      organizationEmail: "dev@tesla.com",
      secret: "we_love_elon_haha",
      adminName: "elon musk",
      adminEmail: "iamelon@tesla.com",
      adminPassword: "teslaspaceX123",
    };

    const res = await request.post("/v1/organizations").send(organization);

    expect(res.status).toBe(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toEqual("Invalid input supplied");
  });
});
