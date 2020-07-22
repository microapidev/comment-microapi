const { connect, disconnect } = require("./db");
const Organization = require("../../models/organizations");
const Application = require("../../models/applications");
const Admin = require("../../models/admins");
const MsAdmin = require("../../models/msadmins");
const SystemSettings = require("../../models/systemSettings");
const { hashPassword } = require("../../utils/auth/passwordUtils");
const { createDefaultAdmin } = require("../../utils/auth/msadmin");
const {
  getAppToken,
  getOrgToken,
  getSysToken,
} = require("../../utils/auth/tokenGenerator");

beforeAll(async () => {
  await connect();
  /* 
  await truncate(Application);
  await truncate(Admin);
  await truncate(Organization); */

  //update system settings
  await SystemSettings.findOneAndUpdate({}, {}, { upsert: true, new: true });

  const date = Date.now();
  const randNum = Math.floor(Math.random() * 99999 + 11111);

  //create default super sysadmin
  process.env.SUPER_ADMIN_EMAIL = `default${date}${randNum}@email.com`;
  process.env.SUPER_ADMIN_PASSWORD = "password";

  const msSuperAdmin = await createDefaultAdmin();

  //create regular sysadmin
  let hashedAdminPassword = await hashPassword("password");
  const msAdmin = new MsAdmin({
    fullname: "Test Admin",
    email: `regularadmin${date}${randNum}@hotels.ng`,
    password: hashedAdminPassword,
  });

  await msAdmin.save();

  //create organization, application and admin objects for use by all tests
  const organization = new Organization({
    name: "HNG",
    email: `hngorg${date}${randNum}@email.com`,
    secret: "shhhh!",
  });

  await organization.save();

  let hashedPassword = await hashPassword("password");
  const admin = new Admin({
    fullname: "admin",
    email: `admin${date}${randNum}@email.com`,
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

  // create a valid token to test routes that require system token
  const superSysToken = await getSysToken(msSuperAdmin.id);
  const sysToken = await getSysToken(msAdmin.id);

  global.sysToken = sysToken;
  global.superSysToken = superSysToken;

  // save variables globally
  global.application = application;
  global.organization = organization;
  global.admin = admin;
  global.msSuperAdmin = msSuperAdmin;
  global.msAdmin = msAdmin;

  //save DB params for annoying requestLimiter storage
  global.DB_USER = process.env.DB_USER;
  global.DB_PASSWORD = process.env.DB_PASSWORD;
  global.DB_URI = process.env.DB_URI;
});

afterAll(async () => {
  await disconnect();
});
