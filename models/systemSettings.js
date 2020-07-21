const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { updateEnvSystemSettings } = require("../utils/settings");

const SystemSettingsSchema = new Schema(
  {
    maxRequestsPerMin: {
      type: Number,
      required: true,
      default: 100,
    },
    maxItemsPerPage: {
      type: Number,
      required: true,
      default: 50,
    },
    defaultItemsPerPage: {
      type: Number,
      required: true,
      default: 20,
    },
    defaultMaxRequestsPerDay: {
      type: Number,
      required: true,
      default: 10000,
    },
  },
  {
    timestamps: true,
  }
);

SystemSettingsSchema.post("save", function (setting) {
  if (setting) {
    updateEnvSystemSettings(setting);
  }
});

const SystemSetting = mongoose.model("SystemSettings", SystemSettingsSchema);
module.exports = SystemSetting;
