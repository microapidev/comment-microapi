const MsAdmin = require("../../models/msadmins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const { hashPassword } = require("../../utils/auth/passwordUtils");

/**
 * @author David Okanlawon
 *
 * Creates a single admin.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const createSingleAdmin = async (req, res, next) => {
  //get arguments
  const { fullname, email, password, role } = req.body;
  const { role: adminRole } = req.token;

  //check if admin account is valid and exists in organization
  if (adminRole !== "superadmin") {
    next(
      new CustomError(401, "You are not authorized to access this resource")
    );
    return;
  }

  //---- TO-DO password should prolly be system generated for new acccounts -----
  //hash password
  let hashedPassword;
  try {
    hashedPassword = await hashPassword(password);
  } catch (error) {
    next(new CustomError(400, "A password processing error occured"));
  }

  //save new admin in DB
  let newAdmin;
  try {
    newAdmin = new MsAdmin({
      fullname: fullname,
      email: email,
      password: hashedPassword,
      role: role,
    });

    await newAdmin.save();
  } catch (error) {
    const errorType =
      error.code === 11000 ? ": admin account already exists" : "";

    next(
      new CustomError(
        400,
        "An error occured creating admin account" + errorType
      )
    );
    return;
  }

  //return new adminId
  return responseHandler(
    res,
    201,
    { msAdminId: newAdmin._id },
    "Admin account created successfully"
  );
};

module.exports = createSingleAdmin;
