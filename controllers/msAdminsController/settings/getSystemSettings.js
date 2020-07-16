const SystemSettings = require("../../../models/systemSettings");
const responseHandler = require("../../../utils/responseHandler");

const getSystemSettings = async (req, res, next) => {
  try {
    const systemSettings = await SystemSettings.findOne({}).select(
      "-_id -createdAt -updatedAt -__v"
    ); // exclude fields above from doc

    return responseHandler(
      res,
      200,
      systemSettings,
      "System settings retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = getSystemSettings;
