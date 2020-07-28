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
    disableRequestLimits: {
      type: Boolean,
      required: true,
      default: false,
    },
    loggingEnabled: {
      type: Boolean,
      required: true,
      default: true,
    },
    logPageSize: {
      type: Number,
      required: true,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

SystemSettingsSchema.post("findOneAndUpdate", function (setting) {
  if (setting) {
    updateEnvSystemSettings(setting);
  }
});

const SystemSetting = mongoose.model("SystemSettings", SystemSettingsSchema);
module.exports = SystemSetting;
