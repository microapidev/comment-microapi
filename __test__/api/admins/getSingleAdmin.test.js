const app = require("../../../server");
const AdminModel = require("../../../models/admins");
const OrganizationModel = require("../../../models/organizations");
const { hashPassword } = require("../../../utils/auth/passwordUtils");
const supertest = require("supertest");
const request = supertest(app);

//const bearerToken = `bearer ${global.appToken}`;
describe("Get a single Admin", () => {
  let savedAdmin;
  beforeAll(async () => {
    let org = {
      name: "SafeGame Ltd",
      email: "safegame@gmail.ng",
      password: "safegame123",
    };

    let admin = {
      fullname: "Tunji Alabi",
      email: "tjsafe@gmail.com",
      password: "tjsafegame",
    };
    //create a new organisation
    const hashSecret = await hashPassword(org.password);
    const mockedOrgDoc = new OrganizationModel({
      name: org.name,
      email: org.email,
      secret: hashSecret,
    });

    const organization = await mockedOrgDoc.save();

    const hashAdminSecret = await hashPassword(admin.password);
    const mockedOrgAdmin = new AdminModel({
      fullname: admin.fullname,
      email: admin.email,
      password: hashAdminSecret,
      organizationId: organization._id,
    });

    savedAdmin = await mockedOrgAdmin.save();
  });

  it("Should get a single Admin for an organisation", async () => {
    const url = `/v1/admins/${savedAdmin._id}`;
    const bearerToken = `bearer ${global.appToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.fullname).toEqual(savedAdmin.adminName);
    expect(res.body.data.email).toEqual(savedAdmin.adminEmail);
    expect(res.body.data._id).toEqual(savedAdmin._id);
  });

  it("Should return a 401 error if Authentication fails", async () => {
    const url = `/v1/admins/${savedAdmin._id}`;
    const bearerToken = `bearer ${global}`; //an invalid token
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("Should return a 404 error if ID is wrong or missing", async () => {
    const url = `/v1/admins/53aec977449ku86300083`; //wrong id
    const bearerToken = `bearer ${global.appToken}`;
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });

  it("Should return a 422 error if validation fails", async () => {
    const url = `/v1/admins/${savedAdmin._id}`;
    const bearerToken = `bearer ${global.appToken}`; //an invalid token
    const res = await request.get(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
