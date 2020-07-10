const { connect, disconnect } = require("./db");
const Organization = require("../../models/organizations");
const Application = require("../../models/applications");
const Admin = require("../../models/admins");
const { hashPassword } = require("../../utils/auth/passwordUtils");
const { getAppToken, getOrgToken } = require("../../utils/auth/tokenGenerator");

beforeAll(async () => {
  await connect();
  /* 
  await truncate(Application);
  await truncate(Admin);
  await truncate(Organization); */

  const date = Date.now();

  //create organization, application and admin objects for use by all tests
  const organization = new Organization({
    name: "HNG",
    email: `hngorg${date}@email.com`,
    secret: "shhhh!",
  });

  await organization.save();

  let hashedPassword = await hashPassword("password");
  const admin = new Admin({
    fullname: "admin",
    email: `admin${date}@email.com`,
    password: hashedPassword,
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

  // create a valid token to test routes that require organization token
  const orgToken = await getOrgToken(organization._id, admin._id);

  global.orgToken = orgToken;

  // save variables globally
  global.application = application;
  global.organization = organization;
  global.admin = admin;
});

afterAll(async () => {
  await disconnect();
});
