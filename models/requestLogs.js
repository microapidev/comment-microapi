const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const REQUEST_METHODS = ["GET", "POST", "PATCH", "PUT", "DELETE"];

const RequestLogSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
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
    responseMessage: {
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

const RequestLog = mongoose.model("RequestLogs", RequestLogSchema);
module.exports = RequestLog;
