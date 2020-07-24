const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  loggingEnabled: {
    type: Boolean,
  },
  maxLogRetentionPeriod: {
    type: Number,
  },
  maxRequestPerMin: {
    type: Number,
  },
  maxRequestPerDay: {
    type: Number,
  },
});
PlanSchema.plugin(mongoosePaginate);
const Plans = mongoose.model("Plans", PlanSchema);
module.exports = Plans;
