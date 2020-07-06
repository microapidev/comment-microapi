const responseHandler = require("../../utils/responseHandler");
const { getAppToken } = require("../../utils/auth/tokenGenerator");

const getApplicationToken = async (req, res, next) => {
  const { applicationId } = req.params;
  const { adminId } = req.token;
  try {
    const token = await getAppToken(applicationId, adminId);
    return responseHandler(
      res,
      201,
      { applicationToken: token },
      "successfully generated token"
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = getApplicationToken;
