const app = require("../../../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const { getOrgToken } = require("../../../utils/auth/tokenGenerator");
const request = supertest(app);

describe("PATCH /applications/:applicationId", () => {
  let orgToken, url;
  beforeAll(async () => {
    orgToken = await getOrgToken(global.organization._id, global.admin._id);
    url = `/v1/applications/${global.application._id}`;
  });

  it("successfully update application information", async () => {
    let res = await request
      .patch(url)
      .set("Authorization", `bearer ${orgToken}`)
      .send({ name: "new name" });
    expect(res.status).toEqual(200);
    expect(res.body.data.applicationId).toEqual(String(global.application._id));
    expect(res.body.data.name).toEqual("new name");
  });

  it("returns 404 for unknown application", async () => {
    let fakeId = mongoose.Types.ObjectId();
    let res = await request
      .patch(`/v1/application/${fakeId}`)
      .set("Authorization", `bearer ${orgToken}`)
      .send({ name: "new name" });
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.error.toLowerCase()).toEqual(
      expect.stringContaining("application")
    );
  });

  it("returns 401 for unauthorized user", async () => {
    let res = await request.patch(url).send({ name: "new name" });
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("returns 422 for missing inputs", async () => {
    let res = await request
      .patch(url)
      .set("Authorization", `bearer ${orgToken}`);
    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
