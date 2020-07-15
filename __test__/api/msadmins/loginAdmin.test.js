const app = require("../../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("POST /msadmins/login", () => {
  const url = "/v1/msadmins/login";

  let adminInfo;
  beforeEach(async () => {
    adminInfo = {
      email: global.msAdmin.email,
      password: "password",
    };
  });

  it("Should login successfully", async () => {
    const res = await request.post(url).send({
      email: adminInfo.email,
      password: adminInfo.password,
    });
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.systemToken).toBeTruthy();
  });

  it("Should return authentication error on failed login", async () => {
    const res = await request.post(url).send({
      email: adminInfo.email,
      password: "garbledygook",
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
