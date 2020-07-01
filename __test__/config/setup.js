const { connect, disconnect } = require("./db");
const Organization = require("../../models/organizations");
const Application = require("../../models/applications");
const Admin = require("../../models/admins");
const { getAppToken } = require("../../utils/auth/tokenGenerator");

beforeAll(async () => {
  await connect();
  /* 
  await truncate(Application);
  await truncate(Admin);
  await truncate(Organization); */

  const randNum = Math.floor(Math.random() * 8000) + 1000;

  //create organization, application and admin objects for use by all tests
  const organization = new Organization({
    name: "HNG",
    email: `hngorg${randNum}@email.com`,
    secret: "shhhh!",
  });

  await organization.save();

  const admin = new Admin({
    fullname: "admin",
    email: `admin${randNum}@email.com`,
    password: "password",
    organizationId: organization._id,
  });

  await admin.save();

  const application = new Application({
    name: "my new app",
    organizationId: organization._id,
    createdBy: admin._id,
  });

  await application.save();

  // create a valid token for tests with these values
  const appToken = await getAppToken(application._id, admin._id);

  global.appToken = appToken;

  // save variables globally
  global.application = application;
  global.organization = organization;
  global.admin = admin;
});

afterAll(async () => {
  await disconnect();
});
