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
        maxRequestPerDay: { type: Number },
        expiryDate: { type: Date },
        isActive: { type: Boolean, default: true },
      },
    ],
    perMinuteLimits: [
      {
        maxRequestPerMin: { type: Number },
        expiryDate: { type: Date },
        isActive: { type: Boolean, default: true },
      },
    ],
    logging: [
      {
        value: { type: Boolean, default: false },
        expiryDate: { type: Date },
        maxLogRetentionPeriod: { type: Number },
        isActive: { type: Boolean, default: true },
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
