const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  },
  {
    timestamps: true,
    capped: { size: 10000, max: 1 },
  }
);
const SystemSetting = mongoose.model("SystemSettings", SystemSettingsSchema);
module.exports = SystemSetting;
