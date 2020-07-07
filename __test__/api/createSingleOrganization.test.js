const app = require("../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("POST /organization", () => {
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
});
