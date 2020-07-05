const Admin = require("../../models/admins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const { getOrgToken } = require("../../utils/auth/tokenGenerator");
const { comparePassword } = require("../../utils/auth/passwordUtils");

/**
 * @author David Okanlawon
 *
 * Gets a single organization's token.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getSingleOrganizationToken = async (req, res, next) => {
  // find admin account in organization
  const { email, password, organizationId } = req.body;

  // find email of admin in organization
  const admin = await Admin.findOne({ email, organizationId });

  // if not found return error
  if (!admin) {
    next(new CustomError(400, "Invalid email and/or password"));
    return;
  }

  //if found compare password
  let passwordMatched;
  try {
    passwordMatched = await comparePassword(password, admin.password);
  } catch (error) {
    next(new CustomError("Password check error"));
    return;
  }

  //if not password matched return error
  if (!passwordMatched) {
    next(new CustomError(400, "Invalid email and/or password"));
    return;
  }

  //if password matched generateToken
  const organizationToken = await getOrgToken(organizationId, admin._id);

  return responseHandler(
    res,
    200,
    {
      organizationToken,
    },
    "Organization token generated successfully"
  );
};

module.exports = getSingleOrganizationToken;
