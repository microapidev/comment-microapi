const app = require("../../server");
const supertest = require("supertest");
const OrganizationModel = require('../../models/organizations');
const request = supertest(app);

describe("POST /organization", () => {
  // 201 Successful Operation
  test("Should create a new organization", async () => {
    const res = await request.post("/v1/organizations").send({
      organizationName: "HNG",
      organizationEmail: "hng@email.com",
      secret: "dohrehmifasolati",
      adminName: "John Doe",
      adminEmail: "johndoe@gmail.com",
      adminPassword: "adminpassword",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.organizationId).toBeTruthy();
    expect(res.body.data.adminId).toBeTruthy();
    expect(res.body.data.organizationToken).toBeTruthy();
  });

  // 400 Bad Request
  test("Should fail at validation due to incomplete parameters", async () => {
    const res = await request.post("/v1/organizations")
      .send({
        organizationEmail: "hng@email.com",
        secret: "dohrehmifasolati",
        adminName: "John Doe",
        adminEmail: "johndoe@gmail.com",
        adminPassword: "adminpassword",
      });
    expect(res.status).toBe(400);
  })

  // 400 Duplicate entry
  test("Should fail because organization already exist", async () => {
    const organization = new OrganizationModel({
      name: "Tesla",
      email: "info@tesla.com",
      secret: "we_all_love_elon"
    })
    await organization.save();

    const res = await request.post("/v1/organizations")
      .send({
        organizationName: "Tesla",
        organizationEmail: "info@tesla.com",
        secret: "spaceX123",
        adminName: "Elon Musk",
        adminEmail: "iamelon@tesla.com",
        adminPassword: "adminpassword",
      });
    const errorType = 11000 ? ": organization email already exists" : "";

    expect(res.status).toBe(400)
    expect(res.body.error).toBe("An error occured creating organization" + errorType);
  })
});
