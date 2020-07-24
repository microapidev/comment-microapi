const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const SubscriptionsSchema = new Schema(
  {
    applicationId: {
      //the id of the application that this subscription belongs to
      type: Schema.Types.ObjectId,
      ref: "Applications",
      required: true,
    },
    subscriptionHistoryId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionsHistory",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    planId: {
      type: String,
      required: true,
    },
    dailyLimits: [
      {
        maxRequestsPerDay: { type: Number },
        expiryDate: { type: Date },
        isActive: { type: Boolean },
      },
    ],
    perMinuteLimits: [
      {
        maxRequestsPerMin: { type: Number },
        expiryDate: { type: Date },
        isActive: { Boolean },
      },
    ],
    logging: [
      {
        value: { type: Boolean, default: false },
        expiryDate: { type: Date },
        maxLogRetentionDays: { type: Number },
        isActive: { type: Boolean },
      },
    ],
    subscriptionStartDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
SubscriptionsSchema.plugin(mongoosePaginate);
const Subscriptions = mongoose.model("Subscriptions", SubscriptionsSchema);
module.exports = Subscriptions;
