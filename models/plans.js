const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const PeriodEnum = Object.freeze({ monthly: 1, quarterly: 3, yearly: 12 });

const PlanSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logging: {
    type: Boolean,
    default: false,
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
  periodWeight: {
    type: String,
    enum: Object.values(PeriodEnum),
    default: 1,
  },
});
Object.assign(PlanSchema.statics, {
  PeriodEnum,
});
PlanSchema.plugin(mongoosePaginate);
const Plans = mongoose.model("Plans", PlanSchema);
module.exports = Plans;
