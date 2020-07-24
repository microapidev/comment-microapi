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
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscriptions",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    logging: {
      value: { type: Boolean, default: false },
      expiryDate: { type: Date },
    },
    requestPerMin: {
      value: { type: Number },
      expiryDate: { type: Date },
    },
    logRetentionPeriod: {
      value: { type: Number },
      expiryDate: { type: Date },
    },
    requestPerDay: {
      value: { type: Number },
      expiryDate: { type: Date },
    },
    subscriptionExpiryDate: {
      type: Date,
      required: true,
    },

    subscriptionStartDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
SubscriptionsSchema.plugin(mongoosePaginate);
const Subscriptions = mongoose.model("Subscriptions", SubscriptionsSchema);
module.exports = Subscriptions;
