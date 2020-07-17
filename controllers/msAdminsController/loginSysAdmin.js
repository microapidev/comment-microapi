const MsAdmin = require("../../models/msadmins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const { getSysToken } = require("../../utils/auth/tokenGenerator");
const { comparePassword } = require("../../utils/auth/passwordUtils");

/**
 * @author David Okanlawon
 *
 * Login a system admin.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const loginSysAdmin = async (req, res, next) => {
  // find msAdmin account in organization
  const { email, password } = req.body;

  // find email of msAdmin in organization
  const msAdmin = await MsAdmin.findOne({ email });

  // if not found return error
  if (!msAdmin) {
    next(new CustomError(401, "Invalid email and/or password"));
    return;
  }

  //if found compare password
  let passwordMatched;
  try {
    passwordMatched = await comparePassword(password, msAdmin.password);
  } catch (error) {
    next(new CustomError("Password check error"));
    return;
  }

  //if not password matched return error
  if (!passwordMatched) {
    next(new CustomError(401, "Invalid email and/or password"));
    return;
  }

  //if password matched generateToken
  const systemToken = await getSysToken(msAdmin._id);

  return responseHandler(
    res,
    200,
    {
      systemToken,
    },
    "Login successful"
  );
};

module.exports = loginSysAdmin;
