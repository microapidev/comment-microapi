const app = require("../../../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const MsAdmin = require("../../../models/msadmins");
const request = supertest(app);

describe("DELETE /msAdmins/:msAdminId", () => {
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

  it("Deletes MsAdmin with provided ID", async () => {
    let res = await request
      .delete(`/v1/msadmins/${msAdmin._id}`)
      .set("Authorization", `bearer ${global.superSysToken}`);

    expect(res.status).toEqual(200);
    expect(res.body.data.fullname).toEqual(msAdmin.fullname);
    expect(res.body.data.email).toEqual(msAdmin.email);

    //confirm record is deleted
    const deletedAdmin = await MsAdmin.findById(msAdmin.id);
    expect(deletedAdmin).toBeFalsy();
  });

  it("returns 404 for msAdmin not found", async () => {
    let wrongId = mongoose.Types.ObjectId();
    let res = await request
      .delete(`/v1/msadmins/${wrongId}`)
      .set("Authorization", `bearer ${global.superSysToken}`);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
  });

  it("returns 401 for unauthorized user", async () => {
    let res = await request.delete(`/v1/msadmins/${msAdmin._id}`);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });

  it("returns 400 when trying to delete one's own account", async () => {
    let res = await request
      .delete(`/v1/msadmins/${global.msSuperAdmin._id}`)
      .set("Authorization", `bearer ${global.superSysToken}`);
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
    expect(res.body.error).toBeTruthy();
  });
});
