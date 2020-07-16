const app = require("../../../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const MsAdmin = require("../../../models/msadmins");
const request = supertest(app);
const softDelete = require("../../../utils/softDelete");

describe("PATCH /msAdmins/:msAdminId/disable", () => {
  let msAdmin;
  beforeEach(async () => {
    msAdmin = new MsAdmin({
      fullname: "admin1",
      email: "admin@domain.com",
      password: "some password",
    });
    await msAdmin.save();
  });

  afterEach(async () => {
    await MsAdmin.findByIdAndDelete(msAdmin._id);
    msAdmin = null;
  });

  it("Disables msAdmin with provided ID", async () => {
    let res = await request
      .patch(`/v1/msadmins/${msAdmin._id}/disable`)
      .set("Authorization", `bearer ${global.superSysToken}`);

    expect(res.status).toEqual(200);
    expect(res.body.data.fullname).toEqual(msAdmin.fullname);
    expect(res.body.data.email).toEqual(msAdmin.email);

    //confirm record can no longer be read
    const deletedAdmin = await MsAdmin.findById(msAdmin.id);
    expect(deletedAdmin).toBeFalsy();
  });

  it("returns 404 for msAdmin not found", async () => {
    let wrongId = mongoose.Types.ObjectId();
    let res = await request
      .patch(`/v1/msadmins/${wrongId}/disable`)
      .set("Authorization", `bearer ${global.superSysToken}`);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
  });

  it("returns 401 for unauthorized user", async () => {
    let res = await request.patch(`/v1/msadmins/${msAdmin._id}/disable`);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});

describe("PATCH /msAdmins/:msAdminId/enable", () => {
  let msAdmin;
  beforeEach(async () => {
    msAdmin = new MsAdmin({
      fullname: "admin1",
      email: "admin@domain.com",
      password: "some password",
    });
    await msAdmin.save();
  });

  afterEach(async () => {
    await MsAdmin.findByIdAndDelete(msAdmin._id);
    msAdmin = null;
  });

  it("Enables msAdmin with provided ID", async () => {
    //confirm doc exists
    await softDelete.deleteById(MsAdmin, msAdmin.id, global.msAdmin.id);

    //confirm document is disabled
    const deletedAdmin = await MsAdmin.findById(msAdmin.id);
    expect(deletedAdmin).toBeFalsy();

    //enable document
    let res = await request
      .patch(`/v1/msadmins/${msAdmin._id}/enable`)
      .set("Authorization", `bearer ${global.superSysToken}`);

    expect(res.status).toEqual(200);
    expect(res.body.data.fullname).toEqual(msAdmin.fullname);
    expect(res.body.data.email).toEqual(msAdmin.email);

    //confirm record can now be found/enabled
    const restoredAdmin = await MsAdmin.findById(msAdmin.id);
    expect(restoredAdmin.id).toEqual(msAdmin.id);
  });

  it("returns 404 for msAdmin not found", async () => {
    let wrongId = mongoose.Types.ObjectId();
    let res = await request
      .patch(`/v1/msadmins/${wrongId}/disable`)
      .set("Authorization", `bearer ${global.superSysToken}`);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
  });

  it("returns 401 for unauthorized user", async () => {
    let res = await request.patch(`/v1/msadmins/${msAdmin._id}/disable`);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
