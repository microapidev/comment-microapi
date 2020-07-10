const app = require("../../../server");
const supertest = require("supertest");
const ApplicationModel = require("../../../models/applications");
const request = supertest(app);

// Cached application.
let application;

describe("GET /applications", () => {
  beforeEach(async () => {
    // Mock an application document.
    const mockedApplicationDoc = new ApplicationModel({
      name: "App",
      organizationId: global.organization._id,
      createdBy: global.admin._id,
    });

    // Save mocked application document to the database and cache it.
    application = await mockedApplicationDoc.save();
  });

  afterEach(async () => {
    // Delete mock from the database.
    await ApplicationModel.findByIdAndDelete(application._id);

    // Delete cache.
    application = null;
  });

  it("Should get all applications", async () => {
    let res = await request
      .get(`/v1/applications`)
      .set("Authorization", `bearer ${global.orgToken}`);

    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual([
      {
        applicationId: String(global.application._id),
        name: global.application.name,
      },
      {
        applicationId: String(application._id),
        name: application.name,
      },
    ]);
  });

  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/applications`;
    const bearerToken = `bearer `;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
});
