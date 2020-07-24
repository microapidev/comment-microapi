const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const SubscriptionsHistorySchema = new Schema(
  {
    applicationId: {
      //the id of the application that this subscriptionsHistory belongs to
      type: Schema.Types.ObjectId,
      ref: "Applications",
      required: true,
    },

    planId: {
      //the id of the plan that this subscriptionsHistory belongs to
      type: Schema.Types.ObjectId,
      ref: "Plans",
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    periodCount: {
      type: Number,
      required: true,
    },
    expiresOn: {
      type: String,
      required: true,
    },

    subscribedOn: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
SubscriptionsHistorySchema.plugin(mongoosePaginate);
const SubscriptionsHistory = mongoose.model(
  "SubscriptionsHistory",
  SubscriptionsHistorySchema
);
module.exports = SubscriptionsHistory;
