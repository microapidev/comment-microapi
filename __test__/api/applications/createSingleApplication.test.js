const app = require("../../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("POST /applications", () => {
  let url;
  let invalidToken = "5f08err3e9dced1ad07err48b9b57a";

  beforeAll(async () => {
    url = "/v1/applications";
  });

  it("Should successfully create an application", async () => {
    let res = await request
      .post(url)
      .set("Authorization", `bearer ${global.orgToken}`)
      .send({ name: "test_app" });

    expect(res.status).toEqual(201);
    expect(res.body.data.applicationId).toBeTruthy();
    expect(res.body.data.applicationToken).toBeTruthy();
    expect(res.body.status).toEqual("success");
  });

  it("Should return a 401 error for invalid Token", async () => {
    let res = await request
      .post(url)
      .set("Authorization", `bearer ${invalidToken}`)
      .send({ name: "test_app" });

    expect(res.status).toEqual(401);
    expect(res.body.data).toEqual([]);
    expect(res.body.status).toEqual("error");
  });
});
