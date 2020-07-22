const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  loggingEnabled: {
    type: String,
    required: true,
  },
  maxLogRetentionPeriod: {
    type: Number,
  },

  requestPerMin: {
    type: Number,
  },
});
PlanSchema.plugin(mongoosePaginate);
const Plans = mongoose.model("Plans", PlanSchema);
module.exports = Plans;
