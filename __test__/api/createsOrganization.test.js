const app = require("../../server");
const supertest = require("supertest");
const request = supertest(app);
const { describeIfEndpoint } = require("../helpers/conditionalTests");

describeIfEndpoint("POST", "/v1/organizations", "POST /v1/organizations", () => {
  test('should create organization and its admin', async () => {
    const response = await request
      .post("/v1/organizations")
      .send({
        organizationName: "HNG",
        organizationEmail: "hng@email.com",
        secret: "hdfiafifqnfnvovv",
        adminName: "John Doe",
        adminEmail: "johndoe@gmail.com",
        adminPassword: "adminpassword"
      })

    expect(response.status).toBe(201);
    expect(response.body.data.organizationId).toBeTruthy()
    expect(response.body.data.adminId).toBeTruthy()
    expect(response.body.data.organizationToken).toBeTruthy()
  });
});

