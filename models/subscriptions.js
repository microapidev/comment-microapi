const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema(
  {
    applicationId: {
      //the id of the application that this subscription belongs to
      type: Schema.Types.ObjectId,
      ref: "Applications",
      required: true,
    },

    planId: {
      //the id of the plan that this subscription belongs to
      type: Schema.Types.ObjectId,
      ref: "Plans",
      required: true,
    },
  },
  { timestamps: true }
);
SubscriptionSchema.plugin(mongoosePaginate);
const Subscriptions = mongoose.model("Subscriptions", SubscriptionSchema);
module.exports = Subscriptions;
