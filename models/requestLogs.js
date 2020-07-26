const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const REQUEST_METHODS = ["GET", "POST", "PATCH", "PUT", "DELETE"];

const RequestLogSchema = new Schema(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Applications",
      required: true,
    },
    requestMethod: {
      type: String,
      required: true,
      enum: REQUEST_METHODS,
    },
    endpoint: {
      type: String,
      required: true,
    },
    responseCode: {
      type: Number,
      required: true,
    },
    statusMessage: {
      type: String,
      required: true,
    },
    maxLogRetention: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

//plug in the pagination package
RequestLogSchema.plugin(mongoosePaginate);

const RequestLog = mongoose.model("RequestLogs", RequestLogSchema);
module.exports = RequestLog;
