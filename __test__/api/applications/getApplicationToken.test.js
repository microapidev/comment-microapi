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

  it("Should get an application's token", async () => {
    let res = await request
      .post(`/v1/applications/${application.id}/token`)
      .set("Authorization", `bearer ${global.orgToken}`);

    expect(res.status).toEqual(201);
    expect(res.body.data.applicationToken).toBeTruthy();
  });

  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/applications/${application.id}/token`;
    const bearerToken = `bearer `;

    const res = await request.post(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual({});
  });

  it("Should return a 404 error when the applicationId doesn't exist in the database", async () => {
    const res = await request
      .post(`/v1/application/4edd30e86762e0fb12000003/token`)
      .set("Authorization", `bearer ${global.orgToken}`);

    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
});
