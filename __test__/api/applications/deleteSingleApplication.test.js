const app = require("../../../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const ApplicationModel = require("../../../models/applications");
const request = supertest(app);

describe("Delete /applications/:applicationId", () => {
  let application;
  beforeEach(async () => {
    application = new ApplicationModel({
      name: "my app",
      organizationId: global.organization._id,
      createdBy: global.admin._id,
    });
    await application.save();
  });

  afterEach(async () => {
    await ApplicationModel.findByIdAndDelete(application._id);
    application = null;
  });

  it("Deletes application with provided ID", async () => {
    let res = await request
      .delete(`/v1/applications/${application._id}`)
      .set("Authorization", `bearer ${global.orgToken}`);
    expect(res.status).toEqual(200);
    expect(res.body.data.applicationId).toEqual(String(application._id));
    expect(res.body.data.name).toEqual(application.name);
  });

  it("returns 404 for application not found", async () => {
    let wrongId = mongoose.Types.ObjectId();
    let res = await request
      .delete(`/v1/application/${wrongId}`)
      .set("Authorization", `bearer ${global.orgToken}`);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
  });

  it("returns 401 for unauthorized user", async () => {
    let res = await request.delete(`/v1/applications/${application._id}`);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
