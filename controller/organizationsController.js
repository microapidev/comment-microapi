// UNCOMMENT EACH MODEL HERE AS NEEDED
const Organizations = require("../models/organizations");
const Admins = require("../models/admins");
const { getOrgToken } = require("../utils/auth/tokenGenerator");
// const Application = require("../models/applications");
// const {ObjectId} = require("mongoose").Types;

const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");

// POST creates an organization
exports.createOrganization = async (req, res, next) => {
  try {
    const newOrganization = new Organizations({
      name: req.body.organizationName,
      email: req.body.organizationEmail,
      secret: req.body.secret,
      adminName: req.body.ownerName,
      adminEmail: req.body.ownerEmail,
      adminPassword: req.body.ownerPassword,
    });
    let org = await newOrganization.save();

    const newAdmin = new Admins({
      fullname: req.body.adminName,
      organizationId: org._id,
      email: req.body.adminEmail,
      password: req.body.adminPassword,
    });

    let admin = await newAdmin.save();

    let token = await getOrgToken(org._id, admin._id);

    const data = {
      organizationId: org._id,
      adminId: admin._id,
      organizationToken: token,
    };
    return responseHandler(res, 201, data, "Organization created successfully");
  } catch (error) {
    return next(
      new CustomError(
        500,
        "Oops, something went wrong, please try again",
        error
      )
    );
  }
};
