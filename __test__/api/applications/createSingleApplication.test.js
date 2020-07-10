const app = require("../../../server");
const supertest = require("supertest");
//const applicationHandler = require("../../../utils/responseHandler");
const { getOrgToken } = require("../../../utils/auth/tokenGenerator");
const request = supertest(app);

describe("POST /applications", () => {
  let orgToken, url;
  let invalidToken = "5f08err3e9dced1ad07err48b9b57a";

  beforeAll(async () => {
    orgToken = await getOrgToken(global.organization._id, global.admin._id);
    url = "/v1/applications";
  });

  it("Should successfully create an application", async () => {
    let res = await request
      .post(url)
      .set("Authorization", `bearer ${orgToken}`)
      .send({ name: "test_app" });
    expect(res.status).toEqual(201);
    expect(res.body.status).toEqual("success");
  });

  it("Should return a 401 error for invalid Token", async () => {
    let res = await request
      .post(url)
      .set("Authorization", `bearer ${invalidToken}`)
      .send({ name: "test_app" });

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
  });
});
