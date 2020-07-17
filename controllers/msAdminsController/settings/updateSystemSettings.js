const SystemSettings = require("../../../models/systemSettings");
const responseHandler = require("../../../utils/responseHandler");

const updateSystemSettings = async (req, res, next) => {
  try {
    //update the settings using validated values from body
    const systemSettings = await SystemSettings.findOneAndUpdate({}, req.body, {
      returnOriginal: false,
      upsert: true, //use upsert if collection is empty
    }).select("-_id -createdAt -updatedAt -__v"); // exclude fields above from doc;

    return responseHandler(
      res,
      200,
      systemSettings,
      "System settings updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = updateSystemSettings;
