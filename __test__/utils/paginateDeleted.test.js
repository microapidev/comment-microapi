const { paginateDeleted } = require("../../utils/paginateDeleted");
const softDelete = require("../../utils/softDelete");
const MsAdmin = require("../../models/msadmins");

describe("Paginete soft-deleted records", () => {
  let msAdmin,
    idsArray = [];
  beforeAll(async () => {
    //create dummy records and softDelete them
    for (let index = 0; index < 20; index++) {
      msAdmin = new MsAdmin({
        fullname: "paginateDeleteTest",
        email: `admin${Date.now()}@domain.com`,
        password: "some password",
      });
      await msAdmin.save();

      idsArray.push(msAdmin.id);

      //soft delete
      if ((index + 2) % 2 === 0) {
        await softDelete.deleteById(MsAdmin, msAdmin.id, global.msAdmin.id);
      }
    }
  });

  afterAll(async () => {
    for (let index = 0; index < idsArray.length; index++) {
      const msAdminId = idsArray[index];
      await softDelete.restoreById(MsAdmin, msAdminId);
      await MsAdmin.findByIdAndDelete(msAdminId);
    }
  });

  it("should get all deleted records", async () => {
    const deletedAdmins = await paginateDeleted(
      MsAdmin,
      "disabled",
      { fullname: "paginateDeleteTest" },
      5,
      1
    );
    expect(deletedAdmins.totalRecords).toEqual(10);
  });

  it("should get all undeleted records", async () => {
    const unDeleted = await paginateDeleted(
      MsAdmin,
      "enabled",
      { fullname: "paginateDeleteTest" },
      5,
      1
    );
    expect(unDeleted.totalRecords).toEqual(10);
  });

  it("should get all records", async () => {
    const allAdmins = await paginateDeleted(
      MsAdmin,
      "all",
      { fullname: "paginateDeleteTest" },
      5,
      1
    );
    expect(allAdmins.totalRecords).toEqual(20);
  });

  //retrieve the deleted records by page
});
