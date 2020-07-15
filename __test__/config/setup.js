const { connect, disconnect } = require("./db");
const Organization = require("../../models/organizations");
const Application = require("../../models/applications");
const Admin = require("../../models/admins");
const MsAdmin = require("../../models/msadmins");
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

  const date = Date.now();

  //create default super sysadmin
  process.env.SUPER_ADMIN_EMAIL = `default${date}@email.com`;
  process.env.SUPER_ADMIN_PASSWORD = "password";

  const msSuperAdminId = await createDefaultAdmin();

  //create regular sysadmin
  let hashedAdminPassword = await hashPassword("password");
  const msAdmin = new MsAdmin({
    fullname: "Test Admin",
    email: `regularadmin${date}@hotels.ng`,
    password: hashedAdminPassword,
  });

  await msAdmin.save();

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

  // create a valid token to test routes that require system token
  const superSysToken = await getSysToken(msSuperAdminId);
  const sysToken = await getSysToken(msAdmin.id);

  global.sysToken = sysToken;
  global.superSysToken = superSysToken;

  // save variables globally
  global.application = application;
  global.organization = organization;
  global.admin = admin;
  global.msSuperAdmin = await MsAdmin.findById(msSuperAdminId);
  global.msAdmin = msAdmin;
});

afterAll(async () => {
  await disconnect();
});
