const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const SubUpgradeHistorySchema = new Schema(
  {
    applicationId: {
      //the id of the application that this subscription belongs to
      type: Schema.Types.ObjectId,
      ref: "Applications",
      required: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscriptions",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    loggingEnabled: {
      type: Boolean,
      default: false,
    },
    loggingExpiryDate: {
      type: Date,
    },
    requestPerMin: {
      type: Number,
    },
    requestPerMinExpiryDate: {
      type: Date,
    },
    logRetentionPeriod: {
      type: Number,
    },
    logRetentionPeriodExpiryDate: {
      type: Date,
    },
    requestPerDay: {
      type: Number,
    },
    requestPerDayExpiryDate: {
      type: Date,
    },
    subscriptionExpiryDate: {
      type: Date,
      required: true,
    },

    subscriptionStartDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
SubUpgradeHistorySchema.plugin(mongoosePaginate);
const SubUpgradeHistory = mongoose.model(
  "SubUpgradeHistory",
  SubUpgradeHistorySchema
);
module.exports = SubUpgradeHistory;
