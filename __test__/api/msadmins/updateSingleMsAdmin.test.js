const app = require("../../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("PATCH /msadmins", () => {
  const url = "/v1/msadmins";

  it("successfully update msadmin details", async () => {
    let res = await request
      .patch(url)
      .set("Authorization", `bearer ${global.sysToken}`)
      .send({ fullname: "admin is I" });
    expect(res.status).toEqual(200);
    expect(res.body.data.fullname).toEqual("admin is I");
  });

  it("returns 401 for unauthorized user", async () => {
    let res = await request.patch(url).send({ name: "admin is I" });
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("returns 422 for missing inputs", async () => {
    let res = await request
      .patch(url)
      .set("Authorization", `bearer ${global.sysToken}`);
    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
