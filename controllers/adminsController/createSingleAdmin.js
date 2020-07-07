const mongoose = require("mongoose");
const Admin = require("../../models/admins");
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
  const { fullname, email, password } = req.body;
  const { adminId, organizationId } = req.token;

  //check if admin account is valid and exists in organization
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    next(new CustomError(400, "Invalid adminId"));
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    next(new CustomError(400, "Invalid organizationId"));
    return;
  }

  const admin = await Admin.find({
    _id: adminId,
    organizationId: organizationId,
  });
  if (!admin) {
    throw new CustomError(
      401,
      "You are not authorized to access this resource"
    );
  }

  //---- TO-DO password should prolly be system generated for new acccounts -----
  //hash password
  let hashedPassword;
  try {
    hashedPassword = await hashPassword(password);
  } catch (error) {
    next(new CustomError(400, "A password processing error occured"));
  }

  //save new admin in organization
  let newAdmin;
  try {
    newAdmin = new Admin({
      fullname: fullname,
      email: email,
      password: hashedPassword,
      organizationId: organizationId,
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
    { adminId: newAdmin._id },
    "Admin account created successfully"
  );
};

module.exports = createSingleAdmin;
