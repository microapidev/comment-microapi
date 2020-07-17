const SystemSettings = require("../../../models/systemSettings");
const responseHandler = require("../../../utils/responseHandler");
const { updateEnvSystemSettings } = require("../../../utils/settings");

const updateSystemSettings = async (req, res, next) => {
  // update mongoDB settings with validated body
  try {
    //update the settings using values from body
    const systemSettings = await SystemSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    //update the system environment variables to match new settings
    updateEnvSystemSettings(systemSettings);

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
